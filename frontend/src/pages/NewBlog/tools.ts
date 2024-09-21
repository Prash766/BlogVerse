import Header from "@editorjs/header";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import ImageTool from "@editorjs/image";
import { axiosClient } from "@/axios/axios";
import LinkTool from '@editorjs/link';
import List from "@editorjs/list";

export const EDITOR_JS_TOOLS = {
  header: {
    //@ts-ignore
    class: Header,
    inlineToolbar: ["link"],
    shortcut: "CMD+SHIFT+H",
  },
  inlineCode: {
    class: InlineCode,
  },
  delimiter: Delimiter,
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: "http://localhost:8787/api/v1/uploadFile", // Your backend file uploader endpoint
      },
      uploader: {
        uploadByFile(file: Blob) {
          const formData = new FormData();
          formData.append("image", file);

          return axiosClient
            .post("/blog/uploadFile", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((response) => {
              return {
                success: 1,
                file: {
                  url: response.data.file.url,
                },
              };
            })
            .catch((error) => {
              console.error("Upload failed:", error);
              return {
                success: 0,
                message: "Upload failed",
              };
            });
        },
        async uploadByUrl(url: string) {
          if (url) {
            const res = await axiosClient.post(
              `/blog/fetchUrl`,
              { url },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (res.status === 200) {
              console.log(res);
              return {
                success: 1,
                file: {
                  url: res.data.file.url,
                },
              };
            }
          }
          return {
            success: 0,
            message: "URL upload failed",
          };
        },
      },
    },
  },
  linkTool:{
    class:LinkTool,
    config:{
      endpoint:`http://localhost:8787/api/v1/linkInfo`,
      
    }
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered'
    }
  },  
  


};
