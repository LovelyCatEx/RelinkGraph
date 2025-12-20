# RelinkGraph

RelinkGraph is a Kotlin project for building and executing **graph-based workflows**.
Workflows are modeled as an IR (intermediate representation) graph of nodes and typed ports, then executed by a runtime that maps node types to executors.

RelinkGraph is inspired by UE4 Blueprints: an `Exec` chain drives evaluation, while typed data pins feed values between nodes.

```text
Exec:  [Entry] ─────▶ [Add] ─────▶ [Mul] ─────▶ [Exit]

Data:  x:Int ─────┐
                  ├────▶ [Add] ─── (x+y) ───┐
       y:Int ─────┘                         │
                                            ├────▶ [Mul] ─── z:Int ───▶ [Exit]
     k:Int (Const) ─────────────────────────┘

Result: z = (x + y) * k
```

RelinkGraph uses a `Graph` to represent a class-like definition and a `Workflow` to represent a function-like definition, and it avoids unpredictable cross-state by not allowing multiple `Exec` entry points within the same workflow.

## Modules

- `relink-ir`: Serializable IR model (graphs, workflows, nodes, ports, types).
- `relink-std`: "Standard Library" of common IR nodes and runtime values/executors (entry/exit, constants, math ops, comparators, controls, etc.).
- `relink-runtime`: Execution engine that runs an `IrRelinkGraph` by turning each workflow into an executable `Workflow`.

## Requirements

- JDK 21+
- Maven 3.9+

## Build & Test

```bash
mvn install
```

## License

Apache-2.0. See `LICENSE`.
