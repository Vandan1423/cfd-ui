/**
 * pipelineSteps.js
 *
 * Data for PipelineTab.jsx — two arrays of step objects,
 * one per stage. Edit text here without touching any JSX.
 *
 * Shape:
 *   { number, label, desc }
 */

export const STAGE1_STEPS = [
  {
    number: 1,
    label:  'Unstructured Mesh',
    desc:   'Jittered 30×30 point cloud triangulated with Delaunay. Irregular element sizes — unsuitable for structured CFD solvers.',
  },
  {
    number: 2,
    label:  'Boundary Extraction',
    desc:   '4 sides identified and parameterised by arc-length t∈[0,1]. Linear interpolation gives smooth boundary curves.',
  },
  {
    number: 3,
    label:  'TFI Particular Solution',
    desc:   'Transfinite Interpolation gives B(ξ,η) satisfying boundary conditions exactly at all 4 edges. Corner correction applied.',
  },
  {
    number: 4,
    label:  'PINN Correction',
    desc:   'X = B + D·NN where D = ξ(1−ξ)η(1−η). D=0 on boundary so BCs are never disturbed. Interior smoothed via ∇²X = 0.',
  },
  {
    number: 5,
    label:  'Structured Grid CSV',
    desc:   '60×60 = 3600 node (x,y) coordinates written to structured_grid_xy.csv for use in Stage 2.',
  },
];

export const STAGE2_STEPS = [
  {
    number: 1,
    label:  'Load Structured Grid',
    desc:   'CSV loaded. Delaunay re-triangulated for connectivity. Boundary nodes (on 4 edges) and interior nodes indexed separately.',
  },
  {
    number: 2,
    label:  'Prescribe BCs',
    desc:   'Top wall: v = −0.20·sin(πx). Bottom, left, right walls: fixed at u = v = 0. Simulates an oscillating ALE boundary.',
  },
  {
    number: 3,
    label:  'Stage 1: Soft-BC PINN',
    desc:   'Loss = L_PDE + 25·L_BC. Network simultaneously minimises Laplacian residual and boundary mismatch. Gives u_par.',
  },
  {
    number: 4,
    label:  'Stage 2: Hard-BC PINN',
    desc:   'ũ = u_par + D(x,y)·NN. D = 0 on boundary analytically, so boundary conditions are satisfied to machine precision.',
  },
  {
    number: 5,
    label:  'Deformed Mesh Output',
    desc:   'x_new = x + ũ_x, y_new = y + ũ_y. Validity checked via signed triangle areas. Zero inverted elements produced.',
  },
];