import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "../../theme";
import { withAlpha } from "../../utils/color";
import { IDENTITY } from "../../data/flow";

export type PhoneScreen = "login" | "profile" | "locked" | "home";

type PhoneProps = {
  width?: number;
  screen?: PhoneScreen;
  accent?: string;
  glow?: boolean;
  style?: React.CSSProperties;
};

const Row: React.FC<{ label: string; value: string; scale: number }> = ({
  label,
  value,
  scale,
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `${10 * scale}px ${14 * scale}px`,
      borderRadius: 12 * scale,
      backgroundColor: "#FFFFFF",
      border: `${1.5 * scale}px solid #E4EAF2`,
    }}
  >
    <span style={{ fontSize: 15 * scale, color: "#5A6875", fontWeight: 600 }}>
      {label}
    </span>
    <span style={{ fontSize: 15 * scale, color: COLORS.ink, fontWeight: 700 }}>
      {value}
    </span>
  </div>
);

export const Phone: React.FC<PhoneProps> = ({
  width = 420,
  screen = "login",
  accent = COLORS.nasabah,
  glow = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const height = width * 2;
  const scale = width / 420;
  const pulse = glow ? 0.35 + Math.abs(Math.sin(frame / 15)) * 0.4 : 0;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 58 * scale,
        backgroundColor: "#1B2430",
        padding: 13 * scale,
        boxShadow: glow
          ? `0 0 0 ${6 * scale}px ${withAlpha(accent, 0.25)}, 0 30px 60px rgba(20,32,27,0.3)`
          : "0 30px 60px rgba(20,32,27,0.28)",
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 46 * scale,
          overflow: "hidden",
          background: "linear-gradient(180deg, #F7FAFF 0%, #EAF1FB 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {glow ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(60% 30% at 50% 0%, ${withAlpha(
                accent,
                0.3,
              )}, transparent 70%)`,
              opacity: pulse,
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            top: 10 * scale,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120 * scale,
            height: 26 * scale,
            borderRadius: 14 * scale,
            backgroundColor: "#1B2430",
            zIndex: 5,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `${30 * scale}px ${26 * scale}px ${8 * scale}px`,
            fontFamily: FONTS.ui,
            fontSize: 14 * scale,
            fontWeight: 700,
            color: "#3A4653",
            zIndex: 4,
          }}
        >
          <span>09:41</span>
          <span style={{ display: "flex", gap: 6 * scale, alignItems: "center" }}>
            <span style={{ letterSpacing: 1 }}>▮▮▮</span>
            <span>▲</span>
            <span>100%</span>
          </span>
        </div>

        <div
          style={{
            position: "relative",
            flex: 1,
            padding: `${14 * scale}px ${26 * scale}px`,
            display: "flex",
            flexDirection: "column",
            gap: 12 * scale,
            fontFamily: FONTS.ui,
          }}
        >
          {screen === "login" ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10 * scale,
                }}
              >
                <div
                  style={{
                    width: 30 * scale,
                    height: 30 * scale,
                    borderRadius: 15 * scale,
                    backgroundColor: COLORS.bank,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 16 * scale,
                  }}
                >
                  B
                </div>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: 17 * scale,
                    color: COLORS.ink,
                  }}
                >
                  {IDENTITY.bank}
                </span>
              </div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 32 * scale,
                  color: COLORS.ink,
                  marginTop: 6 * scale,
                }}
              >
                Masuk
              </div>
              <div
                style={{
                  fontSize: 14 * scale,
                  color: "#65727E",
                  fontWeight: 600,
                  marginBottom: 4 * scale,
                }}
              >
                Selamat datang kembali
              </div>
              <div
                style={{
                  fontSize: 13 * scale,
                  fontWeight: 700,
                  color: "#5A6875",
                }}
              >
                Username
              </div>
              <div
                style={{
                  padding: `${14 * scale}px ${16 * scale}px`,
                  borderRadius: 12 * scale,
                  backgroundColor: "#FFFFFF",
                  border: `${2 * scale}px solid ${withAlpha(accent, 0.5)}`,
                  fontSize: 17 * scale,
                  fontWeight: 700,
                  color: COLORS.ink,
                }}
              >
                {IDENTITY.username}
              </div>
              <div
                style={{
                  fontSize: 13 * scale,
                  fontWeight: 700,
                  color: "#5A6875",
                }}
              >
                Password
              </div>
              <div
                style={{
                  padding: `${14 * scale}px ${16 * scale}px`,
                  borderRadius: 12 * scale,
                  backgroundColor: "#FFFFFF",
                  border: `${1.5 * scale}px solid #E4EAF2`,
                  fontSize: 17 * scale,
                  fontWeight: 700,
                  color: COLORS.ink,
                  letterSpacing: 2,
                }}
              >
                {IDENTITY.maskedPassword}
              </div>
              <div
                style={{
                  marginTop: 10 * scale,
                  padding: `${16 * scale}px`,
                  borderRadius: 14 * scale,
                  backgroundColor: accent,
                  color: "#FFFFFF",
                  textAlign: "center",
                  fontWeight: 800,
                  fontSize: 18 * scale,
                }}
              >
                Masuk
              </div>
            </>
          ) : null}

          {screen === "profile" ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12 * scale,
                }}
              >
                <div
                  style={{
                    width: 44 * scale,
                    height: 44 * scale,
                    borderRadius: 22 * scale,
                    backgroundColor: COLORS.nasabahSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20 * scale,
                    fontWeight: 800,
                    color: COLORS.nasabahDark,
                  }}
                >
                  R
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13 * scale,
                      color: "#65727E",
                      fontWeight: 600,
                    }}
                  >
                    Selamat datang
                  </div>
                  <div
                    style={{
                      fontSize: 19 * scale,
                      fontWeight: 800,
                      color: COLORS.ink,
                    }}
                  >
                    Halo, {IDENTITY.nasabah}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 8 * scale,
                  padding: `${20 * scale}px`,
                  borderRadius: 18 * scale,
                  background: `linear-gradient(135deg, ${COLORS.bankDark}, ${COLORS.bank})`,
                  color: "#FFFFFF",
                }}
              >
                <div
                  style={{
                    fontSize: 14 * scale,
                    fontWeight: 600,
                    opacity: 0.85,
                  }}
                >
                  {IDENTITY.account}
                </div>
                <div
                  style={{
                    fontSize: 13 * scale,
                    fontWeight: 600,
                    opacity: 0.8,
                    marginTop: 10 * scale,
                  }}
                >
                  Saldo Anda
                </div>
                <div
                  style={{
                    fontSize: 34 * scale,
                    fontWeight: 800,
                    letterSpacing: -0.5,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {IDENTITY.balance}
                </div>
              </div>

              <Row label="Transfer" value="Gratis" scale={scale} />
              <Row label="Bayar" value="3 tagihan" scale={scale} />
              <Row label="Riwayat" value="Lihat" scale={scale} />
            </>
          ) : null}

          {screen === "locked" ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16 * scale,
                color: "#5A6875",
              }}
            >
              <div style={{ fontSize: 64 * scale }}>🔒</div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 22 * scale,
                  color: COLORS.ink,
                }}
              >
                Sesi terkunci
              </div>
              <div style={{ fontSize: 15 * scale, fontWeight: 600 }}>
                Menyambung ulang…
              </div>
            </div>
          ) : null}

          {screen === "home" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 14 * scale,
                marginTop: 10 * scale,
              }}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 64 * scale,
                    borderRadius: 16 * scale,
                    backgroundColor: "#FFFFFF",
                    border: `${1.5 * scale}px solid #E4EAF2`,
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div
          style={{
            height: 6 * scale,
            width: 140 * scale,
            borderRadius: 3 * scale,
            backgroundColor: "#B9C4D2",
            alignSelf: "center",
            marginBottom: 10 * scale,
          }}
        />
      </div>
    </div>
  );
};
