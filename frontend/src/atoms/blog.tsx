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
