export class Vec3 {
    values: number[];

    constructor(x: number, y: number, z: number);
    constructor(values: number[]);
    constructor(a: number | number[], b?: number, c?: number) {
        if (a instanceof Array) {
            // We trust the size to be correct (3 elements).
            this.values = a;
        } else {
            this.values = [a, b!, c!];
        }
    }

    get x(): number { return this.values[0]; }
    get y(): number { return this.values[1]; }
    get z(): number { return this.values[2]; }

    set x(val: number) { this.values[0] = val; }
    set y(val: number) { this.values[1] = val; }
    set z(val: number) { this.values[2] = val; }

    static get Zero(): Vec3 { return new Vec3( 0, 0, 0); }
    static get One (): Vec3 { return new Vec3( 1, 1, 1); }

    static get X   (): Vec3 { return new Vec3(1, 0, 0); }
    static get Y   (): Vec3 { return new Vec3(0, 1, 0); }
    static get Z   (): Vec3 { return new Vec3(0, 0, 1); }

    /** Returns this + that. */
    Add(that: Vec3): Vec3 {
        const [a1, a2, a3] = this.values;
        const [b1, b2, b3] = that.values;
        return new Vec3(a1 + b1, a2 + b2, a3 + b3);
    }

    /** Returns this - that. */
    Sub(that: Vec3): Vec3 {
        const [a1, a2, a3] = this.values;
        const [b1, b2, b3] = that.values;
        return new Vec3(a1 - b1, a2 - b2, a3 - b3);
    }

    /** Returns this * that (dot product). */
    Dot(that: Vec3): number {
        const [a1, a2, a3] = this.values;
        const [b1, b2, b3] = that.values;
        return a1 * b1 + a2 * b2 + a3 * b3;
    }

    /**
     * Returns cross product of this x that.
     */
    Cross(that: Vec3): Vec3 {
        const [a1, a2, a3] = this.values;
        const [b1, b2, b3] = that.values;
        return new Vec3(
            a2 * b3 - a3 * b2,
            a3 * b1 - a1 * b3,
            a1 * b2 - a2 * b1,
        );
    }

    /** Returns k * this (scalar product). */
    Times(k: number): Vec3 {
        const [a1, a2, a3] = this.values;
        return new Vec3(k * a1, k * a2, k * a3);
    }

    /** Returns (1/k) * this (scalar division). */
    Div(k: number): Vec3 {
        const [a1, a2, a3] = this.values;
        return new Vec3(a1 / k, a2 / k, a3 / k);
    }

    /** Returns -this. */
    Negate(): Vec3 {
        return this.Times(-1);
    }

    /** Returns the squared magnitude of this vector. */
    MagSqr(): number {
        return this.Dot(this);
    }

    /** Returns the magnitude of this vector. */
    Mag(): number {
        return Math.sqrt(this.MagSqr());
    }

    /** Returns a normalized copy of this vector. */
    Normalized(): Vec3 {
        return this.Div(this.Mag());
    }

    /** Returns the azimuthal angle (angle parallel to the XY-plane), in radians. */
    Azimuth(): number {
        const [x, y] = this.values;
        return Math.atan2(y, x);
    }

    /** Returns the polar angle (angle perpendicular to the XY-plane), in radians. */
    Polar(): number {
        const [x, y, z] = this.values;
        return Math.atan2(Math.sqrt(x * x + y * y), z);
    }

    /** Returns a copy of this vector. */
    Clone(): Vec3 {
        const [a1, a2, a3] = this.values;
        return new Vec3(a1, a2, a3);
    }

    /** Returns a copy of this vector, scaled if needed so its magnitude is at most 'length'. */
    Cap(length: number): Vec3 {
        if (length <= Number.EPSILON) {
            return Vec3.Zero;
        }
        const mag = this.Mag();
        if (length < mag) {
            return this.Times(length / mag);
        }
        return this.Clone();
    }
}

/** Returns the Euclidean distance between u and v. */
export const Dist = (u: Vec3, v: Vec3): number => u.Sub(v).Mag();

/**
 * Returns a Vec3 (Cartesian coordinates) corresponding to the spherical coordinates (radius, polar angle, azimuthal angle).
 *
 * @param radius Vector length.
 * @param polar Angle parallel Z-axis, in range [0, PI].
 * @param azimuth Angle parallel  to XY-plane, in range [0, 2 * PI].
 * @returns Vector, in Cartesian coordinates.
 */
export const FromSpherical = (radius: number, polar: number, azimuth: number): Vec3 => {
    const sp = Math.sin(polar);
    const cp = Math.cos(polar);
    const sa = Math.sin(azimuth);
    const ca = Math.cos(azimuth);
    return new Vec3(radius * sp * ca, radius * sp * sa, radius * cp);
}

/** Linearly interpolate between a at t=0 and b at t=1 (t is NOT clamped). */
export const Interpolate = (a: Vec3, b: Vec3, t: number): Vec3 => a.Add(b.Sub(a).Times(t));

/** Calculate the average vector. */
export const Average = (...vecs: Vec3[]): Vec3 => {
    let accumulator = Vec3.Zero;
    if (vecs.length == 0) {
        return accumulator;
    }

    for (let vec of vecs) {
        accumulator = accumulator.Add(vec);
    }

    return accumulator.Div(vecs.length);
}

/**
 * Calculate the weighted average vector.
 *
 * * Iterates up to shortest length.
 * * Ignores negative or approximately zero weights and their associated vectors.
 */
export const WeightedAverage = (vecs: Vec3[], weights: number[]): Vec3 => {
    let accumulator = Vec3.Zero;
    let totalWeight = 0;

    const N = Math.min(vecs.length, weights.length);
    if (N == 0) {
        return accumulator;
    }

    for (let i = 0; i < N; i++) {
        const vec = vecs[i];
        const weight = weights[i];
        if (weight > Number.EPSILON) {
            totalWeight += weight;
            accumulator = accumulator.Add(vec.Times(weight));
        }
    }

    if (totalWeight > Number.EPSILON) {
        return accumulator.Div(totalWeight);
    } else {
        return accumulator;
    }
}

/** Returns the projection of arbitrary vector 'v' into *unit* vector 'n', as a Vec3. */
export const Project = (v: Vec3, n: Vec3): Vec3 => n.Times(v.Dot(n));
