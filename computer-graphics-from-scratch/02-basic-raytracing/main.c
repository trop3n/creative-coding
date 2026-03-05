#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "../common/vec3.h"
#include "../common/color.h"
#include "../common/ray.h"
#include "../common/ppm.h"

#define IMAGE_WIDTH 320
#define IMAGE_HEIGHT 240

Color ray_color(Ray r) {
    Vec3 unit_direction = vec3_normalize(r.direction);
    float t = 0.5f * (unit_direction.y + 1.0f);
    
    Color white = color_create(1.0f, 1.0f, 1.0f);
    Color blue = color_create(0.5f, 0.7f, 1.0f);
    
    return vec3_add(
        vec3_mul(white, 1.0f - t),
        vec3_mul(blue, t)
    );
}

int main() {
    Color *image = malloc(IMAGE_WIDTH * IMAGE_HEIGHT * sizeof(Color));
    if (!image) {
        fprintf(stderr, "Error: Could not allocate image memory\n");
        return 1;
    }
    
    float aspect_ratio = (float)IMAGE_WIDTH / (float)IMAGE_HEIGHT;
    float viewport_height = 2.0f;
    float viewport_width = aspect_ratio * viewport_height;
    float focal_length = 1.0f;
    
    Vec3 origin = vec3_create(0, 0, 0);
    Vec3 horizontal = vec3_create(viewport_width, 0, 0);
    Vec3 vertical = vec3_create(0, viewport_height, 0);
    Vec3 lower_left_corner = vec3_sub(
        vec3_sub(
            vec3_sub(origin, vec3_mul(horizontal, 0.5f)),
            vec3_mul(vertical, 0.5f)
        ),
        vec3_create(0, 0, focal_length)
    );
    
    for (int j = IMAGE_HEIGHT - 1; j >= 0; j--) {
        fprintf(stderr, "\rScanlines remaining: %d ", j);
        fflush(stderr);
        
        for (int i = 0; i < IMAGE_WIDTH; i++) {
            float u = (float)i / (float)(IMAGE_WIDTH - 1);
            float v = (float)j / (float)(IMAGE_HEIGHT - 1);
            
            Ray r = ray_create(
                origin,
                vec3_add(
                    lower_left_corner,
                    vec3_add(
                        vec3_mul(horizontal, u),
                        vec3_mul(vertical, v)
                    )
                )
            );
            
            image[j * IMAGE_WIDTH + i] = ray_color(r);
        }
    }
    fprintf(stderr, "\nDone!\n");
    
    ppm_write_image("output.ppm", image, IMAGE_WIDTH, IMAGE_HEIGHT);
    free(image);
    
    return 0;
}
