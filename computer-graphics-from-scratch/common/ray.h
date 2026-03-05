#ifndef RAY_H
#define RAY_H

#include "vec3.h"

typedef struct {
    Vec3 origin;
    Vec3 direction;
} Ray;

Ray ray_create(Vec3 origin, Vec3 direction) {
    Ray r;
    r.origin = origin;
    r.direction = direction;
    return r;
}

Vec3 ray_at(Ray r, float t) {
    return vec3_add(r.origin, vec3_mul(r.direction, t));
}

#endif
