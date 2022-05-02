/*
Simple 2D JavaScript Vector Class
Hacked from evanw's lightgl.js
https://github.com/evanw/lightgl.js/blob/master/src/vector.js
*/

export class Vector {
    constructor(x: number, y: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    public x: number;
    public y: number;

    public negative() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }

    public add(v: Vector|number): Vector {
        if (v instanceof Vector) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += v;
            this.y += v;
        }
        return this;
    }

    public subtract(v: Vector|number): Vector {
        if (v instanceof Vector) {
            this.x -= v.x;
            this.y -= v.y;
        } else {
            this.x -= v;
            this.y -= v;
        }
        return this;
    }

    public multiply(v: Vector|number): Vector {
        if (v instanceof Vector) {
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }
        return this;
    }

    public divide(v: Vector|number): Vector {
        if (v instanceof Vector) {
            if (v.x !== 0) { this.x /= v.x; }
            if (v.y !== 0) { this.y /= v.y; }
        } else {
            if (v !== 0) {
                this.x /= v;
                this.y /= v;
            }
        }
        return this;
    }

    public equals(v: Vector): boolean {
        return this.x === v.x && this.y === v.y;
    }

    public dot(v: Vector): number {
        return this.x * v.x + this.y * v.y;
    }

    public cross(v: Vector): number {
        return this.x * v.y - this.y * v.x;
    }

    public length(): number {
        return Math.sqrt(this.dot(this));
    }

    public normalize(): Vector {
        return this.divide(this.length());
    }

    public min(): number {
        return Math.min(this.x, this.y);
    }

    public max(): number {
        return Math.max(this.x, this.y);
    }

    public toAngles(): number {
        return -Math.atan2(-this.y, this.x);
    }

    public angleTo(a: Vector): number {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    }

    public toArray(n?: number): number[] {
        return [this.x, this.y].slice(0, n || 2);
    }

    public clone(): Vector {
        return new Vector(this.x, this.y);
    }

    public set(x: number, y: number): Vector {
        this.x = x; this.y = y;
        return this;
    }

    public scalar_projection(v: Vector) {
        const dot = this.dot(v);
        return dot / v.length();
    }

    public vector_projection(v: Vector) {
        const scalar = this.scalar_projection(v);
        const length: number = v.length();
        return v.divide(length).multiply(scalar);
    }
}
