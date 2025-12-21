/**
 * Copyright 2025 lovelycat
 *
 * Use of this source code is governed by the Apache License, Version 2.0,
 * that can be found in the LICENSE file.
 */
import './App.css'
import {RelinkGraphEditor} from "@/editor/RelinkGraphEditor.tsx";
import {IR_GRAPH_SERIALIZATION_MOCK} from "@/types/relink-graph.types.ts";

function App() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4">
        Relink Graph Editor
      </div>

      <div className="w-full flex-1 flex flex-row">
        <RelinkGraphEditor className="flex-1" initialWorkflow={IR_GRAPH_SERIALIZATION_MOCK.workflows[0]} />
        <div>

        </div>
      </div>
    </div>
  )
}

export default App
