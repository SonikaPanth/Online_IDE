// import React, { useEffect, useState, useRef } from 'react';
// import EditiorNavbar from '../components/EditiorNavbar';
// import Editor from '@monaco-editor/react';
// import { MdLightMode } from 'react-icons/md';
// import { AiOutlineExpandAlt } from "react-icons/ai";
// import { api_base_url } from '../helper';
// import { useParams } from 'react-router-dom';

// const Editior = () => {
//   const [tab, setTab] = useState("html");
//   const [isLightMode, setIsLightMode] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>New Project</title>
//         <style>body { font-family: Arial, sans-serif; }</style>
//     </head>
//     <body>
//         <h1>Hello, World!</h1>
//     </body>
//     </html>`);
    
//   const [cssCode, setCssCode] = useState("body { background-color: #f4f4f4; }");
//   const [jsCode, setJsCode] = useState("// some comment");

//   const { projectID } = useParams();
//   const iframeRef = useRef(null);

//   // Theme toggler using React state
//   useEffect(() => {
//     document.body.classList.toggle("lightMode", isLightMode);
//   }, [isLightMode]);

//   // Function to update the iframe
//   const runCode = () => {
//     if (iframeRef.current) {
//       const iframeDocument = iframeRef.current.contentDocument;
//       iframeDocument.open();
//       iframeDocument.write(`${htmlCode}<style>${cssCode}</style><script>${jsCode}</script>`);
//       iframeDocument.close();
//     }
//   };

//   // Auto-run the code when any of the inputs change
//   useEffect(runCode, [htmlCode, cssCode, jsCode]);

//   // Fetch project data on load
//   useEffect(() => {
//     fetch(api_base_url + "/getProject", {
//       mode: "cors",
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: localStorage.getItem("userId"),
//         projId: projectID,
//       })
//     })
//       .then(res => res.json())
//       .then(data => {
//         setHtmlCode(data.project.htmlCode || "");
//         setCssCode(data.project.cssCode || "");
//         setJsCode(data.project.jsCode || "");
//       })
//       .catch(err => console.error("Error fetching project:", err));
//   }, [projectID]);

//   // Function to manually save the project
//   const saveProject = () => {
//     fetch(api_base_url + "/updateProject", {
//       mode: "cors",
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId: localStorage.getItem("userId"),
//         projId: projectID,
//         htmlCode,
//         cssCode,
//         jsCode,
//       })
//     })
//     .then(res => res.json())
//     .then(data => {
//       alert(data.success ? "✅ Project saved successfully" : "❌ Something went wrong");
//     })
//     .catch(() => alert("⚠️ Failed to save project. Please try again."));
//   };

//   // Handle Ctrl+S to trigger save
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.ctrlKey && event.key === 's') {
//         event.preventDefault();
//         saveProject();
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [htmlCode, cssCode, jsCode]);

//   return (
//     <>
//       <EditiorNavbar />
//       <div className="flex">
//         <div className={`left w-[${isExpanded ? "100%" : "50%"}]`}>
//           <div className="tabs flex items-center justify-between gap-2 w-full bg-[#1A1919] h-[50px] px-[40px]">
//             <div className="tabs flex items-center gap-2">
//               {["html", "css", "js"].map(type => (
//                 <div 
//                   key={type} 
//                   onClick={() => setTab(type)} 
//                   className={`tab cursor-pointer p-[6px] px-[10px] text-[15px] ${tab === type ? "bg-gray-700" : "bg-[#1E1E1E]"}`}
//                 >
//                   {type.toUpperCase()}
//                 </div>
//               ))}
//             </div>

//             <div className="flex items-center gap-2">
//               <MdLightMode className="text-[20px] cursor-pointer" onClick={() => setIsLightMode(!isLightMode)} />
//               <AiOutlineExpandAlt className="text-[20px] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)} />
//             </div>
//           </div>

//           <Editor
//             onChange={(value) => {
//               if (tab === "html") setHtmlCode(value || "");
//               else if (tab === "css") setCssCode(value || "");
//               else setJsCode(value || "");
//             }}
//             height="82vh"
//             theme={isLightMode ? "vs-light" : "vs-dark"}
//             language={tab}
//             value={tab === "html" ? htmlCode : tab === "css" ? cssCode : jsCode}
//           />
//         </div>

//         {!isExpanded && <iframe ref={iframeRef} className="w-[50%] min-h-[82vh] bg-[#fff] text-black" title="output" />}
//       </div>

//       <button 
//         onClick={saveProject} 
//         className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-lg"
//       >
//         Save Project
//       </button>
//     </>
//   );
// };

// export default Editior;

import React, { useEffect, useState, useRef } from 'react';
import EditiorNavbar from '../components/EditiorNavbar';
import Editor from '@monaco-editor/react';
import { MdLightMode } from 'react-icons/md';
import { AiOutlineExpandAlt } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { api_base_url } from '../helper';
import { useParams } from 'react-router-dom';
import JSZip from "jszip";
import { saveAs } from "file-saver";

const Editior = () => {
  const [tab, setTab] = useState("html");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Project</title>
        <style>body { font-family: Arial, sans-serif; }</style>
    </head>
    <body>
        <h1>Hello, World!</h1>
    </body>
    </html>`);
  
  const [cssCode, setCssCode] = useState("body { background-color: #f4f4f4; }");
  const [jsCode, setJsCode] = useState("// some comment");

  const { projectID } = useParams();
  const iframeRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle("lightMode", isLightMode);
  }, [isLightMode]);

  const runCode = () => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      iframeDocument.open();
      iframeDocument.write(`${htmlCode}<style>${cssCode}</style><script>${jsCode}</script>`);
      iframeDocument.close();
    }
  };

  useEffect(runCode, [htmlCode, cssCode, jsCode]);

  useEffect(() => {
    fetch(api_base_url + "/getProject", {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID,
      })
    })
      .then(res => res.json())
      .then(data => {
        setHtmlCode(data.project.htmlCode || "");
        setCssCode(data.project.cssCode || "");
        setJsCode(data.project.jsCode || "");
      })
      .catch(err => console.error("Error fetching project:", err));
  }, [projectID]);

  const saveProject = () => {
    fetch(api_base_url + "/updateProject", {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        projId: projectID,
        htmlCode,
        cssCode,
        jsCode,
      })
    })
    .then(res => res.json())
    .then(data => {
      alert(data.success ? "✅ Project saved successfully" : "❌ Something went wrong");
    })
    .catch(() => alert("⚠️ Failed to save project. Please try again."));
  };

  const downloadProject = () => {
    const zip = new JSZip();
    zip.file("index.html", htmlCode);
    zip.file("style.css", cssCode);
    zip.file("script.js", jsCode);
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "project.zip");
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveProject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [htmlCode, cssCode, jsCode]);

  return (
    <>
      <EditiorNavbar />
      <div className="flex">
        <div className={`left w-[${isExpanded ? "100%" : "50%"}]`}>
          <div className="tabs flex items-center justify-between gap-2 w-full bg-[#1A1919] h-[50px] px-[40px]">
            <div className="tabs flex items-center gap-2">
              {["html", "css", "js"].map(type => (
                <div 
                  key={type} 
                  onClick={() => setTab(type)} 
                  className={`tab cursor-pointer p-[6px] px-[10px] text-[15px] ${tab === type ? "bg-gray-700" : "bg-[#1E1E1E]"}`}
                >
                  {type.toUpperCase()}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <MdLightMode className="text-[20px] cursor-pointer" onClick={() => setIsLightMode(!isLightMode)} />
              <AiOutlineExpandAlt className="text-[20px] cursor-pointer" onClick={() => setIsExpanded(!isExpanded)} />
              <FiDownload className="text-[20px] cursor-pointer" onClick={downloadProject} />
            </div>
          </div>

          <Editor
            onChange={(value) => {
              if (tab === "html") setHtmlCode(value || "");
              else if (tab === "css") setCssCode(value || "");
              else setJsCode(value || "");
            }}
            height="82vh"
            theme={isLightMode ? "vs-light" : "vs-dark"}
            language={tab}
            value={tab === "html" ? htmlCode : tab === "css" ? cssCode : jsCode}
          />
        </div>

        {!isExpanded && <iframe ref={iframeRef} className="w-[50%] min-h-[82vh] bg-[#fff] text-black" title="output" />}
      </div>

      <button 
        onClick={saveProject} 
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Save Project
      </button>
    </>
  );
};

export default Editior;

