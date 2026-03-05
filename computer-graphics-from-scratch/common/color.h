#ifndef COLOR_H
#define COLOR_H

#include "vec3.h"

typedef Vec3 Color;

Color color_create(float r, float g, float b) {
    return vec3_create(r, g, b);
}

Color color_add(Color a, Color b) {
    return vec3_add(a, b);
}

Color color_mul(Color c, float t) {
    return vec3_mul(c, t);
}

Color color_mul_color(Color a, Color b) {
    return vec3_mul_vec(a, b);
}

int color_to_rgb(float value) {
    int result = (int)(255.0f * value);
    if (result < 0) return 0;
    if (result > 255) return 255;
    return result;
}

#endif
