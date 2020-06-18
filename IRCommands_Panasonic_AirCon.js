class IRCommands_Panasonic_AirCon {
    constructor() {
        this.data_symbol_ms = 0.07;
        this.T_unit_ms = 0.445;
        this.trailer_ms = 12;
    }

    commands() {
        return {
            Mode: [
                { key: "ModeCooler", value: 0x3, name: "冷房" },
                { key: "ModeHeater", value: 0x4, name: "暖房" },
                { key: "ModeDehumidifier", value: 0x2, name: "除湿" },
            ],
            Power: [
                { key: "PowerOn", value: 0x1, name: "ON" },
                { key: "PowerOff", value: 0x0, name: "OFF" },
                { key: "PowerOffAndOnTimer", value: 0x2, name: "入タイマー" },
                { key: "PowerOnAndOffTimer", value: 0x5, name: "切タイマー" },
            ],
            AirVolume: [
                { key: "AirVolumeAuto", value: 0xA, name: "オート" },
                { key: "AirVolume1", value: 0x3, name: "1" },
                { key: "AirVolume2", value: 0x4, name: "2" },
                { key: "AirVolume3", value: 0x5, name: "3" },
                { key: "AirVolume4", value: 0x6, name: "4" },
                { key: "AirVolumeStill", value: 0x3, name: "静" },
                { key: "AirVolumePowerful", value: 0x3, name: "パワフル" },
            ],
            WindDirection: [
                { key: "WindDirectionAuto", value: 0xF, name: "オート" },
                { key: "WindDirection1", value: 0x1, name: "1（上）" },
                { key: "WindDirection2", value: 0x2, name: "2" },
                { key: "WindDirection3", value: 0x3, name: "3" },
                { key: "WindDirection4", value: 0x4, name: "4" },
                { key: "WindDirection5", value: 0x5, name: "5（下）" },
            ],
            TimerHour: [
                { key: "TimerHourOff", value: [0x06, 0x60], name: "OFF" },
                { key: "TimerHour1", value: [0xC0, 0x03], name: "1時間" },
                { key: "TimerHour2", value: [0x80, 0x07], name: "2時間" },
                { key: "TimerHour3", value: [0x40, 0x0B], name: "3時間" },
                { key: "TimerHour4", value: [0x00, 0x0F], name: "4時間" },
                { key: "TimerHour5", value: [0xC0, 0x12], name: "5時間" },
                { key: "TimerHour6", value: [0x80, 0x16], name: "6時間" },
                { key: "TimerHour7", value: [0x40, 0x1A], name: "7時間" },
                { key: "TimerHour8", value: [0x00, 0x1E], name: "8時間" },
                { key: "TimerHour9", value: [0xC0, 0x21], name: "9時間" },
                { key: "TimerHour10", value: [0x80, 0x25], name: "10時間" },
                { key: "TimerHour11", value: [0x40, 0x29], name: "11時間" },
                { key: "TimerHour12", value: [0x00, 0x2D], name: "12時間" },
            ],
            PresetTemp: [
                { key: "PresetTemp16", value: 16, name: "16℃" },
                { key: "PresetTemp17", value: 17, name: "17℃" },
                { key: "PresetTemp18", value: 18, name: "18℃" },
                { key: "PresetTemp19", value: 19, name: "19℃" },
                { key: "PresetTemp20", value: 20, name: "20℃" },
                { key: "PresetTemp21", value: 21, name: "21℃" },
                { key: "PresetTemp22", value: 22, name: "22℃" },
                { key: "PresetTemp23", value: 23, name: "23℃" },
                { key: "PresetTemp24", value: 24, name: "24℃" },
                { key: "PresetTemp25", value: 25, name: "25℃" },
                { key: "PresetTemp26", value: 26, name: "26℃" },
                { key: "PresetTemp27", value: 27, name: "27℃" },
                { key: "PresetTemp28", value: 28, name: "28℃", default: true },
                { key: "PresetTemp29", value: 29, name: "29℃" },
                { key: "PresetTemp30", value: 30, name: "30℃" },
            ]
        };
    }

    commandEnum() {
        let M = {};
        for (let [key, val] of Object.entries(this.commands())) {
            val.forEach((v, i, a) => {
                M[v.key] = v.value;
            });
        }
        return M;
    }

    getCallSign() {
        let arr = [0x02, 0x20, 0x0E, 0x04, 0x00, 0x00, 0x00, 0x06];
        return arr;
    }

    getSignalBytes(s) {
        let arr = [0x02, 0x20, 0xE0, 0x04, 0x00];
        let M = this.commandEnum();

        let b = 0;
        b |= s.Mode;
        b <<= 4;
        b |= s.Power;
        arr.push(b);

        b = 0x20;
        b |= (s.PresetTemp - 16) << 1;
        arr.push(b);

        b = 0x80;
        arr.push(b);

        b = s.AirVolume << 4;
        b |= s.WindDirection;
        arr.push(b);

        b = 0x00;
        arr.push(b);

        b = 0;
        if (s.Power === M.PowerOffAndOnTimer || s.Power === M.PowerOnAndOffTimer) {
            b = 0x3C;
        }
        arr.push(b);

        if (s.Power === M.PowerOnAndOffTimer || s.Power === M.PowerOffAndOnTimer) {
            arr = arr.concat(s.TimerHour);
        } else {
            arr = arr.concat(M.TimerHourOff);
        }

        b = 0;
        if (s.AirVolume === M.AirVolumeStill) {
            b |= 1;
        }
        b <<= 5;
        if (s.AirVolume === M.AirVolumePowerful) {
            b |= 1;
        }
        arr.push(b);

        b = 0;
        if (s.PresetTemp <= 16 || s.PresetTemp >= 30) {
            b |= 1;
        }
        b <<= 1;
        arr.push(b);

        arr.push(0x80);
        arr.push(0x00);
        arr.push(0x06);

        let sum = 0x6;
        for (let i = 5; i < 18; i++) {
            sum += arr[i];
        }
        b = (0xFF & sum);
        arr.push(b);
        return arr;
    }

    testGetSignal() {
        let M = this.commandEnum();
        let s = {
            Mode: M.ModeHeater,
            Power: M.PowerOn,
            PresetTemp: 23,
            AirVolume: M.AirVolumeAuto,
            WindDirection: M.WindDirectionAuto,
        };
        let str_hex = this.getSignalBytes(s).reduce((acc, cur) => {
            return acc + `${cur.toString(16).toUpperCase()}, `;
        }, '');

        console.log(str_hex);
    }

    getSignal(s) {
        let callsign = this.encodeAEHA(this.getCallSign());
        let signal = this.encodeAEHA(this.getSignalBytes(s));
        return callsign.concat(signal);
    }

    encodeAEHA(arr) {
        let Tcnt = Math.round(this.T_unit_ms / this.data_symbol_ms);
        let trailerCnt = Math.ceil(this.trailer_ms / this.data_symbol_ms);
        let leader = [];
        leader = leader.concat(new Array(Tcnt * 8).fill(1));
        leader = leader.concat(new Array(Tcnt * 4).fill(0));
        let template = [
            (new Array(Tcnt).fill(1)).concat(new Array(Tcnt).fill(0)),
            (new Array(Tcnt).fill(1)).concat(new Array(Tcnt * 3).fill(0)),
        ];
        let result = arr.reduce((acc, cur, idx) => {
            for (let i = 0; i < 8; i++) {
                acc = acc.concat(template[(cur >> i) & 0b1]);
            }
            return acc;
        }, leader);
        let trailerRaw = new Array(Tcnt).fill(1).concat(new Array(trailerCnt).fill(0));
        return result.concat(trailerRaw);
    }

    decodeAEHA(arr) {
        let currentValue = 1;
        let currentCount = 0;
        let counts = arr.reduce((acc, cur, idx, src) => {
            if (cur == currentValue) {
                currentCount++;
            } else {
                acc.push(currentCount);
                currentCount = 1;
                currentValue = currentValue ? 0 : 1;
            }
            if (idx == src.length - 1) {
                acc.push(currentCount);
            }
            return acc;
        }, []);

        let T_maxcnt = Math.round(0.5 / this.data_symbol_ms);
        let T_mincnt = Math.round(0.35 / this.data_symbol_ms);
        let count2d = counts.reduce((acc, cur, idx, src) => {
            if (idx % 2 == 0) {
            } else {
                acc.push([src[idx - 1], cur]);
            }
            return acc;
        }, []);
        let bin = count2d.reduce((acc, cur, idx) => {
            if (idx == 0 && cur[0] >= T_mincnt * 8 && cur[0] <= T_maxcnt * 8) { return acc; }
            if (cur[0] >= T_mincnt && cur[0] <= T_maxcnt) {
                if (cur[1] >= T_mincnt && cur[1] <= T_maxcnt) {
                    acc.push(0);
                } else if (cur[1] >= T_mincnt * 3 && cur[1] <= T_maxcnt * 3) {
                    acc.push(1);
                }
            }
            return acc;
        }, []);

        let hex_tmp = 0;
        let hex = bin.reduce((acc, cur, idx, src) => {
            hex_tmp |= cur << (idx % 8);
            if (idx % 8 == 7) {
                acc.push(hex_tmp);
                hex_tmp = 0;
            }
            return acc;
        }, []);
        /*
        let str_hex = hex.reduce((acc, cur) => {
            return acc + `${cur.toString(16).toUpperCase()}, `;
        }, '');
        let params = {
            temperature: ((hex[14] & 0b00011110) >> 1) + 16,
            airDirection: hex[16] & 0b00001111,
            airFlow: (hex[16] & 0b11110000) >> 4,
            drive: (hex[13] & 0b11110000) >> 4,
            power: hex[13] & 0b1,
        };
        console.log(params);
        */
        // console.log({ count2d, bin, hex, str_hex });
        return hex;
    }

}


if (typeof module === 'object') {
    module.exports = IRCommands_Panasonic_AirCon;
}
