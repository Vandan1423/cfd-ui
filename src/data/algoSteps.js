/**
 * algoSteps.js
 *
 * Data for AlgorithmTab.jsx — each object maps to one AlgoStep accordion item.
 * The `code` field is a raw string rendered inside <pre> in the tab component.
 * The `body` field is plain prose shown above the code block.
 *
 * Shape:
 *   { number, title, equation, body, code, defaultOpen }
 */

export const ALGO_STEPS = [
  {
    number:      1,
    title:       'Load Structured Mesh',
    equation:    'N = 3600 nodes',
    defaultOpen: true,
    body: `Read structured_grid_xy.csv — the 60×60 node positions from Stage 1.
Re-triangulate using Delaunay to recover element connectivity.
Identify boundary nodes (on the 4 edges) and interior nodes separately
using coordinate tolerances.`,
    code:
`pts  = np.loadtxt("structured_grid_xy.csv", delimiter=",")
tri  = Delaunay(pts)
bidx = np.where(is_boundary)[0]   # boundary node indices
iidx = np.where(~is_boundary)[0]  # interior node indices`,
  },

  {
    number:   2,
    title:    'Prescribe Boundary Conditions',
    equation: 'v = −0.20·sin(πx)',
    body: `The top wall is pushed down sinusoidally — simulating a moving boundary
in an ALE (Arbitrary Lagrangian-Eulerian) CFD simulation.
Bottom, left, and right walls are held fixed at zero displacement.`,
    code:
`# Top wall only
v_bc = -0.20 * np.sin(np.pi * x_top)
u_bc = np.zeros_like(v_bc)
# Bottom / left / right: u = v = 0`,
  },

  {
    number:   3,
    title:    'Distance Function D(x,y)',
    equation: 'D = 0 on ∂Ω',
    body: `Compute the normalised shortest distance from every node to the nearest
boundary node using a k-d tree (cKDTree).
This is the key ingredient of the Hard-BC trick — since D is exactly
zero on the boundary, multiplying any neural network output by D
guarantees it vanishes on the boundary regardless of NN weights.`,
    code:
`tree = cKDTree(pts[bidx])
dist, _ = tree.query(pts, k=1)
D = dist / dist.max()   # normalised ∈ [0, 1]
# D = 0 on boundary nodes
# D > 0 in interior nodes`,
  },

  {
    number:   4,
    title:    'Stage 1 — Soft-BC PINN',
    equation: 'L = L_PDE + 25·L_BC',
    body: `Train a fully-connected MLP (128 neurons × 4 layers, Tanh) with Adam
to simultaneously satisfy the Laplace PDE in the interior and boundary
conditions at boundary nodes.
The high weight (25) on L_BC forces the network to prioritise boundary
matching, producing a smooth "particular solution" u_par.`,
    code:
`loss_pde = (∇²u² + ∇²v²).mean()
loss_bc  = |NN(x_bnd) - u_bc|².mean()
loss     = loss_pde + 25.0 * loss_bc
optimizer.step()  # 4 000 Adam iterations`,
  },

  {
    number:   5,
    title:    'Stage 2 — Hard-BC PINN',
    equation: 'ũ = u_par + D·NN',
    body: `Key insight: since D = 0 on the boundary, the corrected output ũ
always equals u_par on boundary nodes — regardless of what the second
network predicts. BCs are satisfied to machine precision analytically.
Only the Laplacian residual enters the loss — no BC term is needed.`,
    code:
`def corrected_uv(xy):
    return u_par + D * net2(xy)

# On boundary: D=0  →  ũ = u_par = exact BC  ✓
# In interior: D>0  →  net2 corrects PDE residual

loss = (∇²ũ)².mean()   # no BC term needed!`,
  },

  {
    number:   6,
    title:    'Update Node Positions',
    equation: 'x_new = x + ũ',
    body: `Apply the final displacement field to all 3600 nodes.
Validate by computing signed triangle areas — all must be positive
(no inverted elements). Compute quality metrics f_A and f_AR per
triangle using the Stein et al. 2003 formulas.`,
    code:
`pts_new = pts + uv_final   # shape (3600, 2)

# Validity check — signed triangle areas
areas = signed_triangle_areas(pts_new, tris)
assert (areas > 0).all(), "Inverted elements!"

# Quality metrics
fA, fAR = mesh_quality(pts, pts_new, tris)`,
  },
];

// Side-panel explanation data (used in AlgorithmTab sidebar)
export const ARCH_SPECS = [
  { key: 'Input',         value: '(x, y) — node coordinates'  },
  { key: 'Hidden layers', value: '4 × 128 neurons'            },
  { key: 'Activation',   value: 'Tanh (smooth gradients)'     },
  { key: 'Output',        value: '(u, v) — displacement'       },
  { key: 'Init',          value: 'Xavier / Glorot uniform'     },
  { key: 'Optimizer',     value: 'Adam  ·  LR = 1e-3'         },
];