#ifndef UTILS_H
#define UTILS_H

#include <math.h>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

float degrees_to_radians(float degrees) {
    return degrees * M_PI / 180.0f;
}

float clamp(float value, float min, float max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

#endif
