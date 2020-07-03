import {
    Vec3,
    Dist, FromSpherical, Interpolate, Average, WeightedAverage, Project,
} from './index';

// Handy helpers!
const compare = (a: Vec3, b: any) => {
    expect(a.x).toBeCloseTo(b.x);
    expect(a.y).toBeCloseTo(b.y);
    expect(a.z).toBeCloseTo(b.z);
}
const Pi = Math.PI;
const OnesPolarAngle = 0.95531661812;

test("constructor takes parameters (x: number, y: number), which correspond to respective fields. They are represented internally by an array.", () => {
    const v1 = new Vec3(0, 0, 0);
    const v2 = new Vec3(1, 0, 0);
    const v3 = new Vec3(0, 1, 0);
    const v4 = new Vec3(0, 0, 1);
    const v5 = new Vec3(1, 1, 1);
    const v6 = new Vec3(-2, 3.5, 0.4);

    expect(v1).toEqual({ values: [ 0, 0, 0 ] });
    expect(v1.x).toEqual(0);
    expect(v1.y).toEqual(0);
    expect(v1.z).toEqual(0);

    expect(v2).toEqual({ values: [ 1, 0, 0 ] });
    expect(v2.x).toEqual(1);
    expect(v2.y).toEqual(0);
    expect(v2.z).toEqual(0);

    expect(v3).toEqual({ values: [ 0, 1, 0 ] });
    expect(v3.x).toEqual(0);
    expect(v3.y).toEqual(1);
    expect(v3.z).toEqual(0);

    expect(v4).toEqual({ values: [ 0, 0, 1 ] });
    expect(v4.x).toEqual(0);
    expect(v4.y).toEqual(0);
    expect(v4.z).toEqual(1);

    expect(v5).toEqual({ values: [ 1, 1, 1 ] });
    expect(v5.x).toEqual(1);
    expect(v5.y).toEqual(1);
    expect(v5.z).toEqual(1);

    expect(v6).toEqual({ values: [ -2, 3.5, 0.4 ] });
    expect(v6.x).toEqual( -2);
    expect(v6.y).toEqual(3.5);
    expect(v6.z).toEqual(0.4);

});

test("constructor also takes parameter (values: number[]), which correspond to respective fields. They are represented internally by an array.", () => {
    const v1 = new Vec3([0, 0, 0]);
    const v2 = new Vec3([1, 0, 0]);
    const v3 = new Vec3([0, 1, 0]);
    const v4 = new Vec3([0, 0, 1]);
    const v5 = new Vec3([1, 1, 1]);
    const v6 = new Vec3([-2, 3.5, 0.4]);

    expect(v1).toEqual({ values: [ 0, 0, 0 ] });
    expect(v1.x).toEqual(0);
    expect(v1.y).toEqual(0);
    expect(v1.z).toEqual(0);

    expect(v2).toEqual({ values: [ 1, 0, 0 ] });
    expect(v2.x).toEqual(1);
    expect(v2.y).toEqual(0);
    expect(v2.z).toEqual(0);

    expect(v3).toEqual({ values: [ 0, 1, 0 ] });
    expect(v3.x).toEqual(0);
    expect(v3.y).toEqual(1);
    expect(v3.z).toEqual(0);

    expect(v4).toEqual({ values: [ 0, 0, 1 ] });
    expect(v4.x).toEqual(0);
    expect(v4.y).toEqual(0);
    expect(v4.z).toEqual(1);

    expect(v5).toEqual({ values: [ 1, 1, 1 ] });
    expect(v5.x).toEqual(1);
    expect(v5.y).toEqual(1);
    expect(v5.z).toEqual(1);

    expect(v6).toEqual({ values: [ -2, 3.5, 0.4 ] });
    expect(v6.x).toEqual( -2);
    expect(v6.y).toEqual(3.5);
    expect(v6.z).toEqual(0.4);

});

test("Vec3.Add(Vec3): Vec3 returns a new sum vector without modifying the originals.", () => {
    const v1 = new Vec3(1, 2, 3);
    const v2 = new Vec3(3, -4, 0);

    const out1 = v1.Add(v2);
    expect(out1).toEqual(new Vec3(4, -2, 3));
    expect(v1).toEqual(new Vec3(1, 2, 3)); // v1 not modified.
    expect(v2).toEqual(new Vec3(3, -4, 0)); // v2 not modified.

    const out2 = v2.Add(v1);
    expect(out2).toEqual(out1); // Commutativity applies.

    const out3 = v1.Add(v1);
    expect(out3).toEqual(new Vec3(2, 4, 6));

    const out4 = v2.Add(v2);
    expect(out4).toEqual(new Vec3(6, -8, 0));
});

test("Vec3.Sub(Vec3): Vec3 returns a new subtraction vector without modifying the originals.", () => {
    const v1 = new Vec3(1, 2, 3);
    const v2 = new Vec3(3, -4, 0);
    const zero = Vec3.Zero;

    const out1 = v1.Sub(v2);
    expect(out1).toEqual(new Vec3(-2, 6, 3));
    expect(v1).toEqual(new Vec3(1, 2, 3)); // v1 not modified.
    expect(v2).toEqual(new Vec3(3, -4, 0)); // v2 not modified.

    const out2 = v2.Sub(v1);
    expect(out2).toEqual(new Vec3(2, -6, -3)); // Sign changes on order change.

    const out3 = v1.Sub(v1);
    expect(out3).toEqual(zero); // Cancellation.

    const out4 = v2.Sub(v2);
    expect(out4).toEqual(zero); // Cancellation.
});

test("Vec3.Dot(Vec3): number returns a scalar corresponding to the dot product, without modifying the originals.", () => {
    const v1 = new Vec3(1, 2, 3);
    const v2 = new Vec3(3, -4, 1);

    const out1 = v1.Dot(v2);
    expect(out1).toBe(-2);
    expect(v1).toEqual(new Vec3(1, 2, 3)); // v1 not modified.
    expect(v2).toEqual(new Vec3(3, -4, 1)); // v2 not modified.

    const out2 = v2.Dot(v1);
    expect(out2).toBe(out1); // Commutativity applies.

    const out3 = v1.Dot(v1);
    expect(out3).toBe(14); // Modulus squared.

    const out4 = v2.Dot(v2);
    expect(out4).toBe(26); // Modulus squared.

    const out5 = v1.Dot(Vec3.Zero);
    expect(out5).toBe(0);

    const out6 = v2.Dot(Vec3.Zero);
    expect(out6).toBe(0);

    const out7 = v1.Dot(Vec3.One);
    expect(out7).toBe(6); // Trace.

    const out8 = v2.Dot(Vec3.One);
    expect(out8).toBe(0); // Trace.
});

test("Vec3.Cross(Vec3): number returns the cross product, without modifying the originals", () => {
    const v1 = new Vec3(1, 2, 3);
    const v2 = new Vec3(0, 3, 2);

    const out1 = v1.Cross(v1);
    compare(out1, Vec3.Zero); // Parallel vectors get nulled.
    expect(v1).toEqual(new Vec3(1, 2, 3)); // Not modified.

    const out2 = v1.Cross(v2);
    compare(out2, new Vec3(-5, -2, 3));
    expect(v2).toEqual(new Vec3(0, 3, 2)); // Not modified.
});

test("Vec3.Times(number): Vec3 returns a new scaled vector without modifying the original.", () => {
    const v1 = new Vec3(1,  2, 3);
    const v2 = new Vec3(3, -4, 0);

    const out1 = v1.Times(2);
    expect(out1).toEqual(new Vec3(2, 4, 6));
    expect(v1  ).toEqual(new Vec3(1, 2, 3)); // v1 not modified.

    const out2 = v2.Times(2);
    expect(out2).toEqual(new Vec3(6, -8, 0));
    expect(v2  ).toEqual(new Vec3(3, -4, 0)); // v2 not modified.

    const out3 = v1.Times(1);
    expect(out3).toEqual(v1); // Identity.

    const out4 = v1.Times(0);
    expect(out4).toEqual(Vec3.Zero); // Zero.
});

test("Vec3.Div(number): Vec3 returns a new scaled vector without modifying the original.", () => {
    const v1 = new Vec3(1,  2, 3);
    const v2 = new Vec3(3, -4, 0);

    const out1 = v1.Div(2);
    expect(out1).toEqual(new Vec3(0.5, 1, 1.5));
    expect(v1  ).toEqual(new Vec3(1  , 2, 3  )); // v1 not modified.

    const out2 = v2.Div(2);
    expect(out2).toEqual(new Vec3(1.5, -2, 0));
    expect(v2  ).toEqual(new Vec3(3  , -4, 0)); // v2 not modified.

    const out3 = v1.Div(1);
    expect(out3).toEqual(v1); // Identity.
});

test("Vec3.Negate(): Vec3 returns a new negated vector without modifying the original.", () => {
    const v1 = new Vec3(1,  2, 3);
    const v2 = new Vec3(3, -4, 0);

    const out1 = v1.Negate();
    expect(out1).toEqual(new Vec3(-1, -2, -3));
    expect(v1  ).toEqual(new Vec3( 1,  2,  3)); // v1 not modified.

    const out2 = v2.Negate();
    compare(out2, new Vec3(-3,  4, 0));
    expect(v2  ).toEqual(new Vec3( 3, -4, 0)); // v2 not modified.
});

test("Vec3.MagSqr(): number returns the square magnitude of a vector, without modifying the original.", () => {
    const v1 = Vec3.X;
    const v2 = new Vec3(3, -4, 0);
    const v3 = new Vec3(-2, 4, -4);
    const zero = Vec3.Zero;
    const one = Vec3.One;

    expect(v1.MagSqr()).toBe(1);
    expect(v1).toEqual(new Vec3(1, 0, 0)); // v1 not modified.

    expect(v2.MagSqr()).toBe(25);
    expect(v2).toEqual(new Vec3(3, -4, 0)); // v2 not modified.

    expect(v3.MagSqr()).toBe(36);
    expect(v3).toEqual(new Vec3(-2, 4, -4)); // v3 not modified.

    expect(zero.MagSqr()).toBe(0);
    expect(zero).toEqual(Vec3.Zero); // zero not modified.

    expect(one.MagSqr()).toBe(3);
    expect(one).toEqual(Vec3.One); // one not modified.
});

test("Vec3.Mag(): number returns the magnitude of a vector, without modifying the original.", () => {
    const v1 = Vec3.X;
    const v2 = new Vec3(3, -4, 0);
    const v3 = new Vec3(-2, 4, -4);
    const zero = Vec3.Zero;
    const one = Vec3.One;

    expect(v1.Mag()).toBeCloseTo(1);
    expect(v1).toEqual(Vec3.X); // v1 not modified.

    expect(v2.Mag()).toBeCloseTo(5);
    expect(v2).toEqual(new Vec3(3, -4, 0)); // v2 not modified.

    expect(v3.Mag()).toBeCloseTo(6);
    expect(v3).toEqual(new Vec3(-2, 4, -4)); // v3 not modified.

    expect(zero.Mag()).toBeCloseTo(0);
    expect(zero).toEqual(Vec3.Zero); // zero not modified.

    expect(one.Mag()).toBeCloseTo(Math.sqrt(3));
    expect(one).toEqual(Vec3.One); // one not modified.
});

test("Vec3.Normalized(): Vec3 returns a normalized copy of a vector, without modifying the original.", () => {
    const v1 = Vec3.X;
    const v2 = new Vec3(3, -4, 0);
    const v3 = new Vec3(-2, 4, -4);
    const one = Vec3.One;

    compare(v1.Normalized(), new Vec3(1, 0, 0));
    expect(v1).toEqual(new Vec3(1, 0, 0)); // v1 not modified.

    compare(v2.Normalized(), new Vec3(3 / 5, -4 / 5, 0));
    expect(v2).toEqual(new Vec3(3, -4, 0)); // v2 not modified.

    compare(v3.Normalized(), new Vec3(-1 / 3, 2 / 3, -2 / 3));
    expect(v3).toEqual(new Vec3(-2, 4, -4)); // v2 not modified.

    const k = Math.sqrt(1 / 3);
    compare(one.Normalized(), new Vec3(k, k, k));
    expect(one).toEqual(Vec3.One); // one not modified.
});

test("Vec3.Azimuth(): number returns the azimuthal angle (angle in XY-plane, from X-axis, in radians, smallest in modulus) of a vector, without modifying it.", () => {
    const v1 = Vec3.X
    const v2 = Vec3.Y;
    const v3 = Vec3.Z;
    const v4 = new Vec3(-1, 0, 1);
    const v5 = new Vec3(0, -1, -1);
    const v6 = Vec3.One;
    const v7 = new Vec3(Math.sqrt(3) / 2, 0.5, -2 * Math.sqrt(3));

    expect(v1.Azimuth()).toBeCloseTo( 0.0  * Pi); //   0°
    expect(v2.Azimuth()).toBeCloseTo( 0.5  * Pi); //  90°
    expect(v3.Azimuth()).toBeCloseTo( 0.0  * Pi); //  --  Degenerates to zero.

    expect(v4.Azimuth()).toBeCloseTo( 1.0  * Pi); // 180°
    expect(v5.Azimuth()).toBeCloseTo(-0.5  * Pi); // -90° (270°)
    expect(v6.Azimuth()).toBeCloseTo( 0.25 * Pi); //  45°
    expect(v7.Azimuth()).toBeCloseTo(Pi / 6); // 30°
});

test("Vec3.Polar(): number returns the polar angle (angle perpendicular to XY-plane, from Z-axis, in radians, smallest in modulus) of a vector, without modifying it.", () => {
    const v1 = Vec3.X
    const v2 = Vec3.Y;
    const v3 = Vec3.Z;
    const v4 = new Vec3(-1, 0, 1);
    const v5 = new Vec3(0, -1, -1);
    const v6 = Vec3.One;
    const v7 = new Vec3(Math.sqrt(3) / 2, 0.5, -Math.sqrt(3));

    expect(v1.Polar()).toBeCloseTo(0.5  * Pi); //  90°
    expect(v2.Polar()).toBeCloseTo(0.5  * Pi); //  90°
    expect(v3.Polar()).toBeCloseTo(0.0  * Pi); //   0°

    expect(v4.Polar()).toBeCloseTo(0.25 * Pi); //  45°
    expect(v5.Polar()).toBeCloseTo(0.75 * Pi); // 135°
    expect(v6.Polar()).toBeCloseTo(OnesPolarAngle); //  45°
    expect(v7.Polar()).toBeCloseTo(5 * Pi / 6);     // -60°
});

test("Vec3.Clone(): Vec3 returns a copy of the original vector", () => {
    for (let x = -5; x <= +6; x += 1 / 3) {
        for (let y = -7; y <= +8; y += 1 / 4) {
            for (let z = -4; z <= +5; z += 1 / 2) {
                const v1 = new Vec3(x, y, z);
                const v2 = v1.Clone();
                expect(v1).toEqual(v2);
                expect(v1).not.toBe(v2);
            }
        }
    }
});

test("Vec3.Cap() returns a length-capped copy of the original vector", () => {
    for (let x = -5; x <= +6; x += 1 / 3) {
        for (let y = -7; y <= +8; y += 1 / 4) {
            for (let z = -4; z <= +5; z += 1 / 2) {
                const v1 = new Vec3(x, y, z);
                const v2 = v1.Cap(2);
                const m1 = v1.Mag();
                const m2 = v2.Mag();
                expect(m2).toBeCloseTo(Math.min(2, m1));
                expect(v1).not.toBe(v2);
            }
        }
    }
});

test("Dist(u,v) returns the Euclidean distance between u and v", () => {
    const v1   = Vec3.X;
    const v2   = Vec3.Y;
    const v3   = Vec3.Z;
    const v4   = new Vec3(4, -4, 0);
    const zero = Vec3.Zero;
    const one  = Vec3.One;

    // Distance to self is 0.
    expect(Dist(v1  , v1  )).toBeCloseTo(0);
    expect(Dist(v2  , v2  )).toBeCloseTo(0);
    expect(Dist(v3  , v3  )).toBeCloseTo(0);
    expect(Dist(v4  , v4  )).toBeCloseTo(0);
    expect(Dist(zero, zero)).toBeCloseTo(0);
    expect(Dist(one , one )).toBeCloseTo(0);

    // Distance to zero is magnitude.
    expect(Dist(zero, v1 )).toBeCloseTo(1);
    expect(Dist(zero, v2 )).toBeCloseTo(1);
    expect(Dist(zero, v3 )).toBeCloseTo(1);
    expect(Dist(zero, v4 )).toBeCloseTo(Math.sqrt(32));
    expect(Dist(zero, one)).toBeCloseTo(Math.sqrt(3));

    // Misc.
    expect(Dist(v1 , v2)).toBeCloseTo(Math.SQRT2);
    expect(Dist(v1 , v3)).toBeCloseTo(Math.SQRT2);
    expect(Dist(v2 , v1)).toBeCloseTo(Math.SQRT2);
    expect(Dist(v2 , v3)).toBeCloseTo(Math.SQRT2);
    expect(Dist(v3 , v1)).toBeCloseTo(Math.SQRT2);
    expect(Dist(v3 , v2)).toBeCloseTo(Math.SQRT2);

    expect(Dist(v1 , v4)).toBeCloseTo(5);
    expect(Dist(v4 , v1)).toBeCloseTo(5);

    expect(Dist(one, v1)).toBeCloseTo(Math.SQRT2);
    expect(Dist(v1, one)).toBeCloseTo(Math.SQRT2);
});

test("FromSpherical(number, number, number) returns the Vec3 corresponding to the polar representation (radius, polar, azimuth).", () => {
    // Radius degeneracy
    compare(FromSpherical(0, 0.0 * Pi, 0.0 * Pi), Vec3.Zero);
    compare(FromSpherical(0, 0.5 * Pi, 0.0 * Pi), Vec3.Zero);
    compare(FromSpherical(0, 1.0 * Pi, 0.0 * Pi), Vec3.Zero);
    compare(FromSpherical(0, 0.0 * Pi, 0.5 * Pi), Vec3.Zero);
    compare(FromSpherical(0, 0.0 * Pi, 1.0 * Pi), Vec3.Zero);
    compare(FromSpherical(0, 0.5 * Pi, 1.0 * Pi), Vec3.Zero);
    // etc.

    // Axes
    compare(FromSpherical(1, 0.0 * Pi, 0.0 * Pi), Vec3.Z);
    compare(FromSpherical(1, 0.5 * Pi, 0.0 * Pi), Vec3.X);
    compare(FromSpherical(1, 0.5 * Pi, 0.5 * Pi), Vec3.Y);

    // Polar angle should be in range [0, Pi]; azimuthal angle in range [0, 2 * Pi].
    compare(FromSpherical(1, 1.0 * Pi, 0.0 * Pi), Vec3.Z.Negate());
    compare(FromSpherical(1, 0.5 * Pi, 1.0 * Pi), Vec3.X.Negate());
    compare(FromSpherical(1, 0.5 * Pi, 1.5 * Pi), Vec3.Y.Negate());

    // 2-Pi excess does not matter.
    compare(FromSpherical(1,  0.0 * Pi, 0.0 * Pi), Vec3.Z);
    compare(FromSpherical(1,  2.0 * Pi, 0.0 * Pi), Vec3.Z);
    compare(FromSpherical(1, -2.0 * Pi, 0.0 * Pi), Vec3.Z);
    compare(FromSpherical(1,  4.0 * Pi, 0.0 * Pi), Vec3.Z);

    compare(FromSpherical(1, 0.5 * Pi,  0.0 * Pi), Vec3.X);
    compare(FromSpherical(1, 0.5 * Pi,  2.0 * Pi), Vec3.X);
    compare(FromSpherical(1, 0.5 * Pi, -2.0 * Pi), Vec3.X);
    compare(FromSpherical(1, 0.5 * Pi,  4.0 * Pi), Vec3.X);

    // Scaling works as expected.
    compare(FromSpherical(1 * Math.sqrt(3), OnesPolarAngle, 0.25 * Pi), Vec3.One);
    compare(FromSpherical(2 * Math.sqrt(3), OnesPolarAngle, 0.25 * Pi), new Vec3(2, 2, 2));
    compare(FromSpherical(3 * Math.sqrt(3), OnesPolarAngle, 0.25 * Pi), new Vec3(3, 3, 3));
});

test("Interpolate(Vec3, Vec3, number): Vec3 returns the unclamped linear interpolation of two vectors", () => {
    const vec1 = Vec3.Zero;
    const vec2 = Vec3.One;
    const vec3 = new Vec3( 2, 3, 4);
    const vec4 = new Vec3(-7, 6, 5);

    compare(Interpolate(vec1, vec2,  0.0), vec1                      ); // t=0 => a.
    compare(Interpolate(vec1, vec2,  1.0), vec2                      ); // t=1 => b.
    compare(Interpolate(vec1, vec2,  0.5), new Vec3( 0.5,  0.5,  0.5)); // t=1/2 => midpoint.
    compare(Interpolate(vec1, vec2, -1.0), new Vec3(-1.0, -1.0, -1.0)); // Unclamped.
    compare(Interpolate(vec1, vec2,  2.0), new Vec3( 2.0,  2.0,  2.0)); // Unclamped.

    compare(Interpolate(vec3, vec4,  0.0), vec3                     ); // t=0 => a.
    compare(Interpolate(vec3, vec4,  1.0), vec4                     ); // t=1 => b.
    compare(Interpolate(vec3, vec4,  0.5), new Vec3( -2.5, 4.5, 4.5)); // t=1/2 => midpoint.
    compare(Interpolate(vec3, vec4, -1.0), new Vec3( 11.0, 0.0, 3.0)); // Unclamped.
    compare(Interpolate(vec3, vec4,  2.0), new Vec3(-16.0, 9.0, 6.0)); // Unclamped.
});

test("Average(...Vec3): Vec3 calculates the arithmetic mean of a sequence of vectors", () => {
    const vec1 = Vec3.Zero;
    const vec2 = Vec3.One;
    const vec3 = new Vec3( 2, 3, 4);
    const vec4 = new Vec3(-7, 6, 5);

    compare(Average()          , Vec3.Zero              ); // No vectors => zero element.
    compare(Average(vec1)      , vec1                   ); // One vector => itself.
    compare(Average(vec1, vec2), new Vec3(0.5, 0.5, 0.5)); // Two vectors => midpoint.

    compare(Average(vec3)      , vec3                    ); // One vector => itself.
    compare(Average(vec3, vec4), new Vec3(-2.5, 4.5, 4.5)); // Two vectors => midpoint.

    compare(Average(vec1, vec2, vec3)      , new Vec3(1, 4 / 3, 5 / 3));
    compare(Average(vec1, vec2, vec3, vec4), new Vec3(-1, 2.5, 2.5) );
});

test("WeightedAverage(Vec3[], number[]): Vec3 calculates the weighted mean of a sequence of vectors", () => {
    const vec1 = Vec3.One;
    const vec2 = new Vec3(2, 3, 4);

    compare(WeightedAverage([], []), Vec3.Zero); // No vectors => zero element.

    compare(WeightedAverage([vec1], [1]), vec1); // One vector => itself.
    compare(WeightedAverage([vec2], [1]), vec2); // One vector => itself.

    compare(WeightedAverage([vec1], [2]), vec1); // Total weight sum does not matter.
    compare(WeightedAverage([vec1], [0]), Vec3.Zero); // Zero weight => get nothing.

    compare(WeightedAverage([vec1, vec2], [10  ,  0  ]), vec1                 );
    compare(WeightedAverage([vec1, vec2], [ 0  , 15  ]), vec2                 );
    compare(WeightedAverage([vec1, vec2], [ 3.5,  3.5]), new Vec3(1.5, 2, 2.5));
});

test("Project(v, n), with n unit, projects v into <n>", () => {
    const diagonal = Vec3.One.Normalized();
    const v = new Vec3(-2, 3.5, 0.4);
    const k = Math.sqrt(1 / 3);

    // Zero projects to zero.
    compare(Project(Vec3.Zero, Vec3.X), Vec3.Zero);
    compare(Project(Vec3.Zero, Vec3.Y), Vec3.Zero);
    compare(Project(Vec3.Zero, diagonal), Vec3.Zero);

    // Orthogonal vectors project to zero.
    compare(Project(Vec3.X, Vec3.Y), Vec3.Zero);
    compare(Project(Vec3.Y, Vec3.X), Vec3.Zero);

    // Projecting at 45 degrees.
    compare(Project(Vec3.X, diagonal), diagonal.Times(k));
    compare(Project(diagonal, Vec3.X), Vec3.X.Times(k));

    // Algebra!
    compare(Project(v, Vec3.X), Vec3.X.Times(-2));
    compare(Project(v, Vec3.Y), Vec3.Y.Times(3.5));
    compare(Project(v, diagonal), diagonal.Times(1.9 * k));
});

test("X, Y, Z, Zero, One are defined constants with the expected values", () => {
    compare(Vec3.Zero, new Vec3(0, 0, 0));
    compare(Vec3.One , new Vec3(1, 1, 1));

    compare(Vec3.X, new Vec3(1, 0, 0));
    compare(Vec3.Y, new Vec3(0, 1, 0));
    compare(Vec3.Z, new Vec3(0, 0, 1));
});
