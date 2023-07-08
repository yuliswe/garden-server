import type { Gpio } from "onoff";

class Device {
  private waterPin: Gpio | null = null;
  private chanonicalWaterPin: 0 | 1 = 0;

  constructor() {
    if (process.env.NODE_ENV === "production") {
      const Gpio = require("onoff").Gpio;
      this.waterPin = new Gpio(2, "out");
    }
  }

  setWaterPin(bit: 0 | 1) {
    console.log(`Setting water pin to ${bit}`);
    this.waterPin?.writeSync(bit);
    this.chanonicalWaterPin = bit;
  }

  getWaterPin(): 0 | 1 {
    if (this.waterPin) {
      const val = this.waterPin.readSync();
      return val;
    } else {
      return this.chanonicalWaterPin;
    }
  }
}

export type SystemState = {
  watering: boolean;
  waterStartTime: Date | null;
  waterEndTime: Date | null;
  waterDuration: number | null;
  remainingWaterDuration: number | null;
};

export class WateringSystem {
  static device = new Device();
  static instance = new WateringSystem();

  waterStartTime: Date | null = null;
  waterEndTime: Date | null = null;
  private wateringTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.stopWatering(); // in case the device was left on
  }

  isWatering(): boolean {
    const device = WateringSystem.device;
    return device.getWaterPin() != 0;
  }

  private setWatering(status: boolean): void {
    const device = WateringSystem.device;
    device.setWaterPin(status ? 1 : 0);
  }

  stopWatering(): void {
    this.waterStartTime = null;
    this.waterEndTime = null;
    if (this.wateringTimer) {
      clearTimeout(this.wateringTimer);
    }
    this.setWatering(false);
    console.log("Watering stopped");
  }

  startWatering({ minutes }: { minutes: number }): void {
    this.waterStartTime = new Date();
    this.waterEndTime = new Date(
      this.waterStartTime.getTime() + minutes * 60_000
    );
    if (this.isWatering()) {
      console.log(`Updated wateringEndTime at ${this.waterStartTime}`);
    } else {
      console.log(`Watering started at ${this.waterStartTime}`);
    }
    console.log(`Watering for ${minutes} minute(s) until ${this.waterEndTime}`);
    if (this.wateringTimer) {
      clearTimeout(this.wateringTimer);
    }
    this.wateringTimer = setTimeout(() => {
      this.stopWatering();
    }, minutes * 60_000);
    this.setWatering(true);
  }

  getState(): SystemState {
    return {
      watering: this.waterStartTime !== null,
      waterStartTime: this.waterStartTime,
      waterEndTime: this.waterEndTime,
      waterDuration:
        this.waterStartTime && this.waterEndTime
          ? (this.waterEndTime.getTime() - this.waterStartTime.getTime()) /
            60_000
          : null,
      remainingWaterDuration: this.waterEndTime
        ? (this.waterEndTime.getTime() - Date.now()) / 60_000
        : null,
    };
  }
}
