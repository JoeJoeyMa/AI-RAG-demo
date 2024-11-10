
import React from "react";
import {Kbd} from "@nextui-org/react";

const KbdExample = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span>复制:</span>
        <Kbd keys={["command"]}>C</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>粘贴:</span>
        <Kbd keys={["command"]}>V</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>剪切:</span>
        <Kbd keys={["command"]}>X</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>保存:</span>
        <Kbd keys={["command"]}>S</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>撤销:</span>
        <Kbd keys={["command"]}>Z</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>全选:</span>
        <Kbd keys={["command"]}>A</Kbd>
      </div>
    </div>
  );
};

export default KbdExample;
      