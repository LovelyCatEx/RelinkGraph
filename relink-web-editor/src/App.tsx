/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import './App.css'
import {RelinkGraphEditor} from "@/editor/RelinkGraphEditor.tsx";
import {IR_GRAPH_SERIALIZATION_MOCK, type IrPortEdge} from "@/types/relink-graph.types.ts";
import {Button, Dropdown, type DropdownProps, Input, type MenuProps, Splitter, Tabs, Tree} from "antd";
import {
  ApartmentOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  BranchesOutlined,
  BuildOutlined,
  BulbOutlined,
  CalculatorOutlined,
  CaretLeftOutlined,
  CaretRightOutlined, DeleteOutlined, DownSquareOutlined, EditOutlined,
  ExportOutlined,
  ForkOutlined,
  FunctionOutlined,
  LogoutOutlined,
  MenuOutlined,
  PartitionOutlined, PlusOutlined,
  SaveOutlined,
  SwapRightOutlined
} from "@ant-design/icons";
import {createStyles} from "antd-style";
import {type ReactElement, startTransition, useEffect, useState} from "react";
import type {BaseRelinkGraphNode} from "@/editor/node/BaseRelinkGraphNode.ts";
import type {RelinkGraphConnection, RelinkGraphEditorContext} from "@/editor/types";

interface TreeNodeData {
  key: string;
  title: string | ReactElement;
  icon: ReactElement;
  children?: TreeNodeData[];
  type: string;
}

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

  // @ts-ignore
  const [editorContext, setEditorContext] = useState<RelinkGraphEditorContext | null>(null);

  const [nodes, setNodes] = useState<BaseRelinkGraphNode[]>([]);
  const [connections, setConnections] = useState<RelinkGraphConnection[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<BaseRelinkGraphNode[]>([]);

  const currentGraph = IR_GRAPH_SERIALIZATION_MOCK
  const currentWorkflow = IR_GRAPH_SERIALIZATION_MOCK.workflows[0]

  const generateGraphTreeItemKey = (graphName: string) => {
    return `G#${graphName}`;
  }

  const generateWorkflowTreeItemKey = (graphName: string, workflowName: string) => {
    return generateGraphTreeItemKey(graphName) + "#W#" + workflowName;
  }

  const generateWorkflowNodesTreeItemKey = (graphName: string, workflowName: string) => {
    return generateWorkflowTreeItemKey(graphName, workflowName) + "#NODES";
  }

  const generateWorkflowNodeTreeItemKey = (graphName: string, workflowName: string, nodeId: string) => {
    return generateWorkflowNodesTreeItemKey(graphName, workflowName) + "#" + nodeId;
  }

  const generateWorkflowEdgesTreeItemKey = (graphName: string, workflowName: string) => {
    return generateWorkflowTreeItemKey(graphName, workflowName) + "#EDGES";
  }

  const generateWorkflowEdgeTreeItemKey = (graphName: string, workflowName: string, edgeId: string) => {
    return generateWorkflowEdgesTreeItemKey(graphName, workflowName) + "#" + edgeId;
  }

  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  useEffect(() => {
    console.log("rerender tree data");
    const data = [
      {
        type: 'graph',
        title: currentGraph.graphName,
        key: generateGraphTreeItemKey(currentGraph.graphName),
        icon: <ApartmentOutlined />,
        children: currentGraph.workflows.map((workflow) => {
          const workflowTreeItemKey = generateWorkflowTreeItemKey(currentGraph.graphName, workflow.workflowName);

          const nodesTreeItemKey = generateWorkflowNodesTreeItemKey(currentGraph.graphName, workflow.workflowName);
          const edgesTreeItemKey = generateWorkflowEdgesTreeItemKey(currentGraph.graphName, workflow.workflowName);

          // If the workflow is current, using elements from Editor instead of data
          const isCurrentWorkflow = workflow.workflowName == currentWorkflow.workflowName;

          // Determine nodes and edges to rendered
          const renderNodes = (isCurrentWorkflow ? nodes.map((e) => e.node) : workflow.nodes);
          const renderEdges = (isCurrentWorkflow
              ? connections.map((e) => {
                return {
                  from: nodes.find((it) => it.id == e.source)!.node.nodeId,
                  to: nodes.find((it) => it.id == e.target)!.node.nodeId,
                  fromPort: e.sourceOutput,
                  toPort: e.targetInput
                } as IrPortEdge;
              })
              : workflow.portEdges
          );

          return {
            type: 'workflow',
            title: workflow.workflowName,
            key: workflowTreeItemKey,
            icon: <BranchesOutlined />,
            children: [
              {
                type: 'nodes',
                title: <>
                  <span>Nodes&nbsp;</span>
                  <span className="text-[var(--secondary-color)!important]">({renderNodes.length})</span>
                </>,
                key: nodesTreeItemKey,
                icon: <AppstoreAddOutlined />,
                children: renderNodes.map((node) => {
                  return {
                    type: 'node',
                    title: node.nodeId,
                    key: generateWorkflowNodeTreeItemKey(currentGraph.graphName, workflow.workflowName, node.nodeId),
                    icon: (() => {
                      if (node.nodeRole == 'ACTION') {
                        return <FunctionOutlined />;
                      } else if (node.nodeRole == 'PURE') {
                        return <CalculatorOutlined />;
                      } else if (node.nodeRole == 'SOURCE') {
                        return <BulbOutlined />;
                      } else if (node.nodeRole == 'SINK') {
                        return <LogoutOutlined />;
                      } else if (node.nodeRole == 'CONTROL') {
                        return <PartitionOutlined />
                      } else {
                        return <AppstoreOutlined />;
                      }
                    })()
                  }
                })
              },
              {
                type: 'edges',
                title: <>
                  <span>Edges&nbsp;</span>
                  <span className="text-[var(--secondary-color)!important]">({renderEdges.length})</span>
                </>,
                key: edgesTreeItemKey,
                icon: <ForkOutlined />,
                children: renderEdges.map((edge) => {
                  return {
                    type: 'edge',
                    title: `${edge.from}(${edge.fromPort}) => ${edge.to}(${edge.toPort})`,
                    key: generateWorkflowEdgeTreeItemKey(
                      currentGraph.graphName,
                      workflow.workflowName,
                      edge.from + "," + edge.fromPort + "," + edge.to + "," + edge.toPort
                    ),
                    icon: <SwapRightOutlined />
                  }
                })
              }
            ]
          }
        })
      }
    ];

    setTreeData(data);
  }, [nodes, connections, selectedNodes]);

  const [selectedTreeItemKeys, setSelectedTreeItemKeys] = useState<string[]>([]);
  useEffect(() => {
    const selectedWorkflowKeys = [generateWorkflowTreeItemKey(currentGraph.graphName, currentWorkflow.workflowName)];

    const selectedNodeKeys = selectedNodes.map((node) => {
      return generateWorkflowNodeTreeItemKey(currentGraph.graphName, currentWorkflow.workflowName, node.node.nodeId);
    });

    setSelectedTreeItemKeys([...selectedNodeKeys, ...selectedWorkflowKeys]);
  }, [nodes, connections, selectedNodes]);

  const [contextNode, setContextNode] = useState<TreeNodeData | null>(null);
  const getTreeContextMenu = (node: TreeNodeData | null): MenuProps['items'] => {
    if (!node) {
      return [
        { key: 'new-graph', label: 'New Relink Graph', icon: <PlusOutlined /> },
      ];
    }

    if (node.type === 'graph') {
      return [
        { key: 'rename-graph', label: 'Rename Graph', icon: <EditOutlined /> },
        { key: 'new-workflow', label: 'New Workflow', icon: <PlusOutlined /> },
      ];
    }

    if (node.type === 'workflow') {
      return [
        { key: 'rename-workflow', label: 'Rename Workflow', icon: <EditOutlined /> },
        { key: 'delete-workflow', label: 'Delete Workflow', icon: <DeleteOutlined /> },
      ];
    }

    if (node.type === 'nodes') {
      return [
        { key: 'open', label: 'Expand Nodes', icon: <DownSquareOutlined /> },
      ];
    }

    if (node.type === 'node') {
      return [
        { key: 'delete-node', label: 'Delete Node', icon: <DeleteOutlined /> },
      ];
    }

    if (node.type === 'edges') {
      return [
        { key: 'open', label: 'Expand Connections', icon: <DownSquareOutlined /> },
      ];
    }

    if (node.type === 'edge') {
      return [
        { key: 'delete-edge', label: 'Delete Connection', icon: <DeleteOutlined /> },
      ];
    }
  };

  const contextMenuStyles: DropdownProps['styles'] = {
    root: {
      border: '1px solid var(--secondary-color-a-50)',
      borderRadius: '8px',
    },
    item: {
      minWidth: '256px',
      padding: '0.5rem 1rem',
      fontSize: '1em',
    },
    itemTitle: {
      fontWeight: '500',
    },
    itemIcon: {
      fontSize: '1em',
      // color: 'var(--primary-color)',
      marginRight: '1em',
    },
    itemContent: {
      backgroundColor: 'transparent',
    },
  };

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
          {/* Left Panel */}
          <Splitter.Panel defaultSize={320} min={280} max="40%" collapsible>
            <div className="size-full border-r border-white/5 overflow-hidden flex flex-col text-[var(--on-background-color)]">
              <Dropdown
                styles={contextMenuStyles}
                className="size-full min-w-[256px]"
                menu={{
                  items: getTreeContextMenu(contextNode),
                  onClick: ({ key }) => {
                    console.log('Operate', key, 'Node', contextNode);
                    setContextNode(null);
                  },
                }}
                trigger={['contextMenu']}
                onOpenChange={(open) => {
                  if (!open) {
                    setContextNode(null);
                  }
                }}
              >
                <div className="p-4 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold tracking-widest uppercase">TestGraph</h3>
                    <MenuOutlined className="cursor-pointer" />
                  </div>

                  <div className="flex-1 overflow-y-scroll custom-scrollbar pr-5">
                    <Tree
                      showIcon
                      showLine
                      multiple
                      defaultExpandAll
                      treeData={treeData}
                      className="bg-transparent custom-tree-ui"
                      selectedKeys={selectedTreeItemKeys}
                      selectable={true}
                      onRightClick={({node}) => {
                        setContextNode(node);
                      }}
                    />
                  </div>
                </div>
              </Dropdown>
            </div>
          </Splitter.Panel>

          <Splitter.Panel>
            <div className="size-full relative shadow-inner flex-1 overflow-hidden group">
              <RelinkGraphEditor
                className="size-full"
                initialWorkflow={IR_GRAPH_SERIALIZATION_MOCK.workflows[0]}
                onEditorInitialized={(ctx) => setEditorContext(ctx)}
                onSelectedNodesChanged={(nodes) => {
                  startTransition(() => {
                    setSelectedNodes((prev) => {
                      if (prev.isEmpty() && nodes.isEmpty()) {
                        return prev;
                      }

                      if (prev.length == nodes.length && prev.all((it) => nodes.map((e) => e.id).includes(it.id))) {
                        return prev;
                      }

                      return nodes;
                    });
                  });
                }}
                onNodesChanged={(_, nodes) => {
                  startTransition(() => {
                    setNodes(nodes);
                  });
                }}
                onConnectionsChanged={(_, connections) => {
                  startTransition(() => {
                    setConnections(connections);
                  });
                }}
              />
            </div>
          </Splitter.Panel>

          {/* Right Panel */}
          <Splitter.Panel defaultSize="20%" min={256} max="40%" collapsible>
            <div className="pl-4 pr-4 pb-4 pt-2 h-full flex flex-col border-l border-white/5 text-[var(--on-background-color)]">
              <Tabs
                defaultActiveKey="1"
                className="editor-tabs-compact"
                items={[
                  { key: '1', label: 'Inspector' },
                  { key: '2', label: 'Settings' },
                ]}
              />

              <div className="flex-1 overflow-auto mt-4 space-y-4 pr-1 custom-scrollbar">
                <section>
                  <div className="font-bold uppercase mb-3 flex items-center gap-2">
                    <div className="w-1 h-3 rounded-full bg-[var(--primary-color)]"></div>
                    <span>Transform</span>
                  </div>

                  <div className="space-y-3">
                    {[['Position', '0.0'], ['Rotate', '0.0'], ['Scale', '1.0']].map(([label, val]) => (
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
