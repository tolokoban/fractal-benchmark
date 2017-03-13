// Compile this C code with https://mbebenita.github.io/WasmExplorer/


void compute(
    unsigned char* data, int dots,
    unsigned int W, unsigned int H, int CX, int CY, int Z,
    float pa, float vxa, float vya, float m11a, float m12a, float m21a, float m22a,
    float pb, float vxb, float vyb, float m11b, float m12b, float m21b, float m22b,
    float pc, float vxc, float vyc, float m11c, float m12c, float m21c, float m22c,
    float pd, float vxd, float vyd, float m11d, float m12d, float m21d, float m22d
) {
  unsigned long values[64];
  unsigned int i;

  // Initialise seed for Mitchell and Moore algorithm.
  for( i=0 ; i<55 ; i++ ) {
    values[i] = ((i*i + 47813) * 7) & 0xFFFF;
  }

  unsigned long size = (W * H) << 2;
  unsigned char v;
  unsigned int rnd, p, idx;
  unsigned int x, y, xx, yy, xd, yd;
  unsigned int n = 54;
  unsigned int a = 64 - 24;
  unsigned int b = 64 - 55;

  while( dots --> 0) {
    n = (n + 1) & 63;
    rnd = (values[(a + n) & 63] + values[(b + n) & 63]) & 0xFFFF;
    values[n] = rnd;
    p = rnd & 1023;
    if( p < pa ) {
      xx = x * m11a + y * m12a + vxa;
      yy = x * m21a + y * m22a + vya;
    }
    else if( p < pb ) {
      xx = x * m11b + y * m12b + vxb;
      yy = x * m21b + y * m22b + vyb;
    }
    else if( p < pc ) {
      xx = x * m11c + y * m12c + vxc;
      yy = x * m21c + y * m22c + vyc;
    }
    else {
      xx = x * m11d + y * m12d + vxd;
      yy = x * m21d + y * m22d + vyd;
    }
    xd = xx*Z + CX;
    yd = yy*Z + CY;
    idx = 1 + ((xd + W * yd) << 2);
    if( idx > 0 && idx <= size ) {
      v = data[idx];
      if( v < 255 ) {
        data[idx] = v + 1;
      }
    }
    x = xx;
    y = yy;
  }
}




int main(int argc, char** argv) {
  unsigned char data[(640 * 640) << 2];
  compute(
    data, 1000,
    640, 640, 320, 640, -64,
    850, .85, .04, -.04, .85, 0, 1.6,
    10, 0, 0, 0, .16, 0, 0,
    70, .2, -.26, .23, .22, 0, 1.6,
    70, -.15, .28, .26, .24, -.15, .28
  );
}
