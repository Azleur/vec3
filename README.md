# 2D Vector class

`Vec3` is yet another 3D vector class.
It has a rich feature set for basic vector creation and manipulation.
It looks like this:

```typescript
const vec1 = new Vec3(1, 2, 3); // vec1 = {x: 1, y: 2, z: 3}
vec1.x = 4; // vec1 = {x: 4, y: 2, z: 3}
const vec2 = vec1.Times(3); // vec2 = {x: 12, y: 6, z: 9}
const vec3 = vec2.Sub(vec1); // vec3 = {x: 8, y: 4, z: 6}
...

```

The code is a single TypeScript file with doc comments, so take a look for more details!
