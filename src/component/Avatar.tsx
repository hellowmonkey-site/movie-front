import { imagePreview } from "@/helper/viewer";

interface IProp {
  src: string;
}

export default function Avatar(prop: IProp) {
  return (
    <div
      class="avatar bg-cover"
      style={{ backgroundImage: `url(${prop.src})` }}
      onClick={e => {
        imagePreview(prop.src);
      }}
    ></div>
  );
}
