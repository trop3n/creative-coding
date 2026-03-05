#ifndef PPM_H
#define PPM_H

#include <stdio.h>
#include "color.h"

void ppm_write_header(FILE *file, int width, int height) {
    fprintf(file, "P3\n%d %d\n255\n", width, height);
}

void ppm_write_pixel(FILE *file, Color color) {
    int r = color_to_rgb(color.x);
    int g = color_to_rgb(color.y);
    int b = color_to_rgb(color.z);
    fprintf(file, "%d %d %d\n", r, g, b);
}

void ppm_write_image(const char *filename, Color *pixels, int width, int height) {
    FILE *file = fopen(filename, "w");
    if (!file) {
        fprintf(stderr, "Error: Could not open file %s\n", filename);
        return;
    }
    
    ppm_write_header(file, width, height);
    
    for (int i = 0; i < width * height; i++) {
        ppm_write_pixel(file, pixels[i]);
    }
    
    fclose(file);
    printf("Written: %s (%dx%d)\n", filename, width, height);
}

#endif
