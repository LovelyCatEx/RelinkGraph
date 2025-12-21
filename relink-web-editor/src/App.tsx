/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import './App.css'
import {RelinkGraphEditor} from "@/editor/RelinkGraphEditor.tsx";
import {IR_GRAPH_SERIALIZATION_MOCK} from "@/types/relink-graph.types.ts";
import {Button, Input, Splitter, Tabs, Tree} from "antd";
import {
  AimOutlined,
  BlockOutlined,
  BuildOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
  ExportOutlined,
  EyeOutlined,
  MenuOutlined,
  SaveOutlined
} from "@ant-design/icons";
import {createStyles} from "antd-style";

function App() {
  const useStyles = createStyles(({ token }) => ({
    dragger: {
      '&::before': {
        backgroundColor: 'transparent !important',
      },
      '&:hover::before': {
        border: `1px dashed ${token.colorPrimary}`,
      },
    },
    draggerActive: {
      '&::before': {
        border: `1px dashed ${token.colorPrimary}`,
      },
    },
    collapsibleIcon: {
      fontSize: 24,
      color: token.colorBorder,

      '&:hover': {
        color: token.colorPrimary,
      },
    },
  }));

  const { styles } = useStyles();

  const treeData = [
    {
      title: 'World Root',
      key: '0-0',
      icon: <BuildOutlined />,
      children: [
        { title: 'Skybox', key: '0-0-0', icon: <BlockOutlined /> },
        { title: 'Directional Light', key: '0-0-1', icon: <EyeOutlined /> },
        {
          title: 'Player Character',
          key: '0-0-2',
          icon: <AimOutlined />,
          children: [
            { title: 'Mesh', key: '0-0-2-0' },
            { title: 'Camera', key: '0-0-2-1' },
          ],
        },
      ],
    },
  ];

  return (
    <div className="h-screen w-full font-sans overflow-hidden select-none bg-[var(--background-color)] text-[var(--on-background-color)]">
      <div className="h-full bg-transparent flex flex-col">
        {/* Header Container */}
        <div className="px-6 flex items-center justify-between border-b border-white/5 h-14 shrink-0 shadow-lg z-10 p-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BuildOutlined className="text-white text-lg" />
            </div>
            <span className="font-bold text-md tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              RelinkGraph Editor
            </span>
          </div>

          <div className="flex items-center p-0.5 rounded-xl border border-white/10 space-x-2">
            <Button type="text" className="h-8 w-8 flex items-center justify-center" icon={<SaveOutlined />} />
            <Button type="text" className="h-8 w-8 flex items-center justify-center" icon={<ExportOutlined />} />
          </div>

          <div className="flex items-center gap-2">
            <Button>
              Import
            </Button>
            <Button type="primary">
              Export
            </Button>
          </div>
        </div>

        <Splitter
          classNames={{ dragger: { default: styles.dragger, active: styles.draggerActive } }}
          collapsibleIcon={{
            start: <CaretLeftOutlined className={styles.collapsibleIcon} />,
            end: <CaretRightOutlined className={styles.collapsibleIcon} />,
          }}
        >
          {/* Left Pane */}
          <Splitter.Panel defaultSize={256} min={256} max="40%" collapsible>
            <div className="size-full border-r border-white/5 overflow-hidden flex flex-col text-[var(--on-background-color)]">
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold tracking-widest uppercase">TestGraph</h3>
                  <MenuOutlined className="cursor-pointer" />
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar">
                  <Tree
                    showIcon
                    defaultExpandAll
                    treeData={treeData}
                    className="bg-transparent custom-tree-ui"
                  />
                </div>
              </div>
            </div>
          </Splitter.Panel>

          <Splitter.Panel>
            <div className="size-full relative shadow-inner flex-1 overflow-hidden group">
              <RelinkGraphEditor className="size-full" initialWorkflow={IR_GRAPH_SERIALIZATION_MOCK.workflows[0]} />
            </div>
          </Splitter.Panel>

          <Splitter.Panel defaultSize="20%" min={256} max="40%" collapsible>
            <div className="pl-4 pr-4 pb-4 pt-2 h-full flex flex-col border-l border-white/5 text-[var(--on-background-color)]">
              <Tabs
                defaultActiveKey="1"
                className="editor-tabs-compact"
                items={[
                  { key: '1', label: 'Inspector' },
                  { key: '2', label: 'Styles' },
                  { key: '3', label: 'Events' },
                ]}
              />

              <div className="flex-1 overflow-auto mt-4 space-y-4 pr-1 custom-scrollbar">
                <section>
                  <div className="font-bold uppercase mb-3 flex items-center gap-2">
                    <div className="w-1 h-3 rounded-full bg-[var(--primary-color)]"></div>
                    <span>Transform</span>
                  </div>

                  <div className="space-y-3">
                    {[['位置', '0.0'], ['旋转', '0.0'], ['缩放', '1.0']].map(([label, val]) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="w-12">{label}</span>
                        <div className="flex-1 grid grid-cols-3 gap-1">
                          <Input size="small" defaultValue={val} className="border-none text-gray-300 rounded-md text-center h-7 text-[11px]" />
                          <Input size="small" defaultValue={val} className="border-none text-gray-300 rounded-md text-center h-7 text-[11px]" />
                          <Input size="small" defaultValue={val} className="border-none text-gray-300 rounded-md text-center h-7 text-[11px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </Splitter.Panel>
        </Splitter>
      </div>
    </div>
  )
}

export default App
