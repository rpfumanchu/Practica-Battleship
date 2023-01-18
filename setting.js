export const setting = {
    UTILS: {
      ROWS: 10,
      COLS: 10,
      MAX_BULLETS: 100,
      HIT: "💥",
      FAIL: "💦",
      HIDDEN: "❓",///💤❌💣🩸⚓🏴‍☠️🕋🔥🛫⛵🚤🚢💢
      SUNKEN: "🔥",
      EMPTY: "  ",
    },
    SHIPS: {
      lancha: {
        name: "Lancha motora",
        icon: "⛵",
        count: 3,
        LENGTH: 1,
        lives: 1,
      },
      crucero: {
        name: "Crucero de combate",
        icon: "🚢",
        count: 3,
        LENGTH: 2,
        lives: 2,
      },
      submarino: { name: "US 58", icon: "🚤", count: 2, LENGTH: 3, lives: 3 },
      buque: {
        name: "Buque de gerra",
        icon: "🕋",
        count: 1,
        LENGTH: 4,
        lives: 4,
      },
      portaaviones: {
        name: "Portaaviones",
        icon: "🛫",
        count: 1,
        LENGTH: 5,
        lives: 5,
      },
    },
  };

export const BOATS = [
setting.SHIPS.lancha,
setting.SHIPS.crucero,
setting.SHIPS.submarino,
setting.SHIPS.buque,
setting.SHIPS.portaaviones,
];

export const iconsShow = [
setting.UTILS.FAIL,
setting.UTILS.SUNKEN,
setting.UTILS.HIT,
];
  