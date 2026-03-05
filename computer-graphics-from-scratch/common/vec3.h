#ifndef VEC3_H
#define VEC3_H

#include <math.h>

typedef struct {
    float x, y, z;
} Vec3;

Vec3 vec3_create(float x, float y, float z) {
    Vec3 v;
    v.x = x;
    v.y = y;
    v.z = z;
    return v;
}

Vec3 vec3_add(Vec3 a, Vec3 b) {
    return vec3_create(a.x + b.x, a.y + b.y, a.z + b.z);
}

Vec3 vec3_sub(Vec3 a, Vec3 b) {
    return vec3_create(a.x - b.x, a.y - b.y, a.z - b.z);
}

Vec3 vec3_mul(Vec3 v, float t) {
    return vec3_create(v.x * t, v.y * t, v.z * t);
}

Vec3 vec3_mul_vec(Vec3 a, Vec3 b) {
    return vec3_create(a.x * b.x, a.y * b.y, a.z * b.z);
}

float vec3_dot(Vec3 a, Vec3 b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

Vec3 vec3_cross(Vec3 a, Vec3 b) {
    return vec3_create(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
    );
}

float vec3_length(Vec3 v) {
    return sqrt(vec3_dot(v, v));
}

Vec3 vec3_normalize(Vec3 v) {
    float len = vec3_length(v);
    if (len > 0) {
        return vec3_mul(v, 1.0f / len);
    }
    return v;
}

Vec3 vec3_negate(Vec3 v) {
    return vec3_create(-v.x, -v.y, -v.z);
}

#endif
