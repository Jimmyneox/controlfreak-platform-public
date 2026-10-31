/* Marketing simulation configuration. No live hardware or network calls. */
window.CFD_CONFIG = {
  product: "Cold Plunge Control Pro",
  readouts: [
    {
      label: "Air",
      unit: "\u00b0F",
      min: 0,
      max: 100,
      value: 46,
      jitter: 0.2,
    },
    {
      label: "Chiller outlet",
      unit: "\u00b0F",
      min: 30,
      max: 70,
      value: 37,
      jitter: 0.1,
    },
  ],
  controls: [
    {
      label: "Chiller",
      on: true,
    },
    {
      label: "Pump",
      on: true,
    },
    {
      label: "Ozone",
      on: true,
    },
    {
      label: "UV",
      on: true,
    },
    {
      label: "Heater",
      on: false,
    },
    {
      label: "Spare",
      on: false,
    },
    {
      label: "Lights",
      on: false,
    },
    {
      label: "Spare 2",
      on: false,
    },
  ],
  notify: {
    label: "Water too warm: 45 \u00b0F at ready-by",
    channels: ["Push", "Text", "Email", "Alarm"],
  },
  cues: [
    {
      name: "Plunge",
      icon: "waves",
      target: 39,
    },
    {
      name: "Sam",
      icon: "person",
      target: 45,
    },
    {
      name: "Soak",
      icon: "droplets",
      set: {
        Pump: false,
        Ozone: false,
        UV: false,
      },
      dur: {
        Pump: 15,
        Ozone: 15,
        UV: 15,
      },
    },
    {
      name: "Clean",
      icon: "wrench",
      set: {
        Chiller: false,
        Pump: false,
        Ozone: false,
        UV: false,
      },
    },
  ],
  cueSkip: ["Heater", "Spare", "Lights", "Spare 2"],
  cueTarget: {
    label: "Water target",
    unit: "\u00b0F",
    min: 35,
    max: 60,
    step: 1,
    value: 39,
  },
  cueNewIcon: "person",
};
