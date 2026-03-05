CC = gcc
CFLAGS = -Wall -Wextra -O2 -I.
LDFLAGS = -lm

.PHONY: all clean ch02 ch03

all: ch02 ch03

ch02:
	@echo "Building Chapter 2: Basic Raytracing..."
	$(CC) $(CFLAGS) 02-basic-raytracing/main.c $(LDFLAGS) -o 02-basic-raytracing/raytracer
	@echo "Running Chapter 2..."
	@cd 02-basic-raytracing && ./raytracer

ch03:
	@echo "Building Chapter 3: Light..."
	$(CC) $(CFLAGS) 03-light/main.c $(LDFLAGS) -o 03-light/raytracer
	@echo "Running Chapter 3..."
	@cd 03-light && ./raytracer

clean:
	find . -name "*.ppm" -delete
	find . -name "raytracer" -delete
	find . -name "rasterizer" -delete
	@echo "Cleaned generated files"
