#include <stdio.h>

void compute(
    unsigned char* data, int dots,
    unsigned int W, unsigned int H, unsigned int CX, unsigned int CY, unsigned int Z,
    float pa, float vxa, float vya, float m11a, float m12a, float m21a, float m22a,
    float pb, float vxb, float vyb, float m11b, float m12b, float m21b, float m22b,
    float pc, float vxc, float vyc, float m11c, float m12c, float m21c, float m22c,
    float pd, float vxd, float vyd, float m11d, float m12d, float m21d, float m22d
) {
  while( dots --> 0) {

  }
}

int main(int argc, char** argv) {
  unsigned int W = 640;
  unsigned int H = 640;
  unsigned char data[W * H * 4];

 compute(
   data, 1000000,
   W, H, W / 2, H, -64,
   85, 0, 0, 0, 0, 0, 0,
   1,  0, 0, 0, 0, 0, 0,
   7,  0, 0, 0, 0, 0, 0,
   7,  0, 0, 0, 0, 0, 0
 );
}
