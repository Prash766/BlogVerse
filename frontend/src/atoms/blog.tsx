import { atom } from "recoil";

type blogType = {
  title: string;
  content: string;
  authorId: string;
  published: boolean | null;
  id: string;
};

export const blogInfo = atom<blogType>({
  key: "blogInfoAtom",
  default: {
    title: "",
    authorId: "",
    content: "",
    published: null,
    id: "",
  },
});



export const AttachmentClicked = atom<boolean>({
  key:"attachmentClickedAtom",
  default:false
})

export const PublishButtonClicked = atom<boolean>({
  key:"publishedClickedAtom",
  default:false
})

export const Loading = atom<boolean>({
  key:"booleanatom",
  default:false
})