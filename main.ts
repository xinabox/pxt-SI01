/**
 * SI01 block
 */
//% color=#444444 icon="\uf2d6"
namespace SI01 {
    let LSM9DS1_ACCEL_MG_LSB_2G = 0.000061
    let LSM9DS1_GYRO_DPS_DIGIT_245DPS = 0.00875
    let LSM9DS1_MAG_MGAUSS_4GAUSS = 0.00014

    let LSM9DS1_AG_I2C_ADDRESS = 0x6A
    let LSM9DS1_M_I2C_ADDRESS = 0x1C
    let WHO_AM_I_AG = 0x0F
    let WHO_AM_I_M = 0x0F
    let CTRL_REG1_M = 0x20
    let CTRL_REG2_M = 0x21
    let CTRL_REG3_M = 0x22
    let CTRL_REG4_M = 0x23
    let CTRL_REG1_AG = 0x10
    let CTRL_REG2_G = 0x11
    let CTRL_REG3_G = 0x12
    let CTRL_REG4 = 0x23
    let CTRL_REG5_M = 0x24
    let ORIENT_CFG_G = 0x13
    let CTRL_REG5_XL = 0x1F
    let CTRL_REG6_XL = 0x20
    let CTRL_REG7_XL = 0x21

    // Gyro regs
    let STATUS_REG_G = 0x17
    let GYRO_READY = 0x02
    let OUT_X_L_G = 0x18
    let OUT_X_H_G = 0x19
    let OUT_Y_H_G = 0x1B
    let OUT_Y_L_G = 0x1A
    let OUT_Z_H_G = 0x1D
    let OUT_Z_L_G = 0x1C

    // Accel regs
    let STATUS_REG_A = 0x17
    let ACC_READY = 0x01
    let OUT_X_H_XL = 0x29
    let OUT_X_L_XL = 0x28
    let OUT_Y_H_XL = 0x2B
    let OUT_Y_L_XL = 0x2A
    let OUT_Z_H_XL = 0x2D
    let OUT_Z_L_XL = 0x2C

    //Mag regs
    let STATUS_REG_M = 0x27
    let MAG_READY = 0x08
    let OUT_X_L_M = 0x28
    let OUT_X_H_M = 0x29
    let OUT_Y_L_M = 0x2A
    let OUT_Y_H_M = 0x2B
    let OUT_Z_L_M = 0x2C
    let OUT_Z_H_M = 0x2D

    let SI01_ACK: boolean = false

    let gX: number
    let gY: number
    let gZ: number

    let aX: number
    let aY: number
    let aZ: number

    let mX: number
    let mY: number
    let mZ: number

    export enum GYRO {
        //% block="GX"
        GX = 0,

        //% block="GY"
        GY = 1,

        //% block="GZ"
        GZ = 2
    }

    export enum ACCEL {
        //% block="AX"
        AX = 0,

        //% block="AY"
        AY = 1,

        //% block="AZ"
        AZ = 2
    }

    export enum MAG {
        //% block="MX"
        MX = 0,

        //% block="MY"
        MY = 1,

        //% block="MZ"
        MZ = 2
    }

    class structGyroscope {
        scale: NumberFormat.UInt8LE
        sampleRate: NumberFormat.UInt8LE
        bandwidth: NumberFormat.UInt8LE
        lowpower: boolean
        HPF: boolean
        HPF_CutOFF: boolean
        enable_axis: NumberFormat.UInt8LE
        latchedIRQ: NumberFormat.UInt8LE
        enabled: boolean

        constructor() {

        }

        setupGyro() {
            let tempData: NumberFormat.UInt8LE = 0;

            tempData = this.sampleRate;
            tempData |= this.scale;
            tempData |= this.bandwidth;
            setreg(LSM9DS1_AG_I2C_ADDRESS, CTRL_REG1_AG, tempData);
            tempData = 0;

            tempData = 0x00;
            setreg(LSM9DS1_AG_I2C_ADDRESS, CTRL_REG2_G, tempData);

            tempData = 0x00;
            setreg(LSM9DS1_AG_I2C_ADDRESS, CTRL_REG3_G, tempData);

            tempData = this.enable_axis;
            tempData |= this.latchedIRQ;
            setreg(LSM9DS1_AG_I2C_ADDRESS, CTRL_REG4, tempData);
            tempData = 0;

            tempData = 0x00;
            setreg(LSM9DS1_AG_I2C_ADDRESS, ORIENT_CFG_G, tempData);
            tempData = 0;
        }
    };

    class structAccelromter {
        scale: NumberFormat.UInt8LE
        sampleRate: NumberFormat.UInt8LE
        bandwidth: NumberFormat.UInt8LE
        lowpower: boolean
        enable_axis: NumberFormat.UInt8LE
        enabled: boolean

        constructor() {

        }

        setupAccel() {
            let tempData: NumberFormat.UInt8LE = 0;

            // enable X,Y,Z axis
            tempData = this.enable_axis;
            setreg(LSM9DS1_AG_I2C_ADDRESS, CTRL_REG5_XL, tempData);
            tempData = 0;

            tempData = this.sampleRate;
            tempData |= this.bandwidth;
            tempData |= this.scale;
            setreg(LSM9DS1_AG_I2C_ADDRESS, CTRL_REG6_XL, tempData);
            tempData = 0;

            tempData = 0x00;
            setreg(LSM9DS1_AG_I2C_ADDRESS, CTRL_REG7_XL, tempData);
        }

    };


    class structMagnotomer {
        scale: NumberFormat.UInt8LE
        sampleRate: NumberFormat.UInt8LE
        bandwidth: NumberFormat.UInt8LE
        performanceXY: NumberFormat.UInt8LE
        performanceZ: NumberFormat.UInt8LE
        lowpower: boolean
        mode: NumberFormat.UInt8LE
        fast_read: NumberFormat.UInt8LE
        BDU: NumberFormat.UInt8LE
        enable_axis: NumberFormat.UInt8LE
        enabled: boolean

        constructor() {

        }

        setupMag() {
            let tempData: NumberFormat.UInt8LE = 0;

            tempData = this.performanceXY;
            tempData |= this.sampleRate;
            setreg(LSM9DS1_M_I2C_ADDRESS, CTRL_REG1_M, tempData);
            tempData = 0;

            tempData = this.scale;
            setreg(LSM9DS1_M_I2C_ADDRESS, CTRL_REG2_M, tempData);
            tempData = 0;

            tempData = this.mode;
            setreg(LSM9DS1_M_I2C_ADDRESS, CTRL_REG3_M, tempData);
            tempData = 0;

            tempData = this.performanceZ;
            setreg(LSM9DS1_M_I2C_ADDRESS, CTRL_REG4_M, tempData);
            tempData = 0;

            tempData = this.fast_read;
            tempData |= this.BDU;
            setreg(LSM9DS1_M_I2C_ADDRESS, CTRL_REG5_M, tempData);
            tempData = 0;
        }
    };

    class structTemperature {
        enabled: boolean;

        constructor() {

        }
    };

    class structSensitivity {
        accel: number
        gyro: number
        mag: number

        constructor() {
        }

        setSensitivity(sensitivityACC: number, sensitivityGYRO: number, sensitivityMAG: number) {
            sensitivity.accel = sensitivityACC;
            sensitivity.gyro = sensitivityGYRO;
            sensitivity.mag = sensitivityMAG;
        }
    };

    function setreg(I2C_ADDR: number, reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(I2C_ADDR, buf);
    }

    function getreg(I2C_ADDR: number, reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt8BE);
    }

    function getInt8LE(I2C_ADDR: number, reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.Int8LE);
    }

    function WHO_AM_I() {
        let AG_ID, M_ID: NumberFormat.UInt8LE;
        let COMBINED_ID: NumberFormat.UInt16LE = 0;
        AG_ID = M_ID = 0;

        AG_ID = getreg(LSM9DS1_AG_I2C_ADDRESS, WHO_AM_I_AG);
        M_ID = getreg(LSM9DS1_M_I2C_ADDRESS, WHO_AM_I_M);

        COMBINED_ID = ((AG_ID << 8) | M_ID);

        return COMBINED_ID;
    }

    function readGyro() {
        let data: NumberFormat.Int16LE = 0;

        let newData: NumberFormat.UInt8LE = 0;

        newData = getreg(LSM9DS1_AG_I2C_ADDRESS, STATUS_REG_G);
        if (newData & GYRO_READY) {
            data = getInt8LE(LSM9DS1_AG_I2C_ADDRESS, OUT_X_H_G);
            data <<= 8;
            data |= getreg(LSM9DS1_AG_I2C_ADDRESS, OUT_X_L_G);
            gX = data * sensitivity.gyro;
            data = 0;

            data = getInt8LE(LSM9DS1_AG_I2C_ADDRESS, OUT_Y_H_G);
            data <<= 8;
            data |= getreg(LSM9DS1_AG_I2C_ADDRESS, OUT_Y_L_G);
            gY = data * sensitivity.gyro;
            data = 0;

            data = getInt8LE(LSM9DS1_AG_I2C_ADDRESS, OUT_Z_H_G);
            data <<= 8;
            data |= getreg(LSM9DS1_AG_I2C_ADDRESS, OUT_Z_L_G);
            gZ = data * sensitivity.gyro;
        }
    }

    function readAccel() {
        let data: NumberFormat.Int16LE = 0;
        let newData: NumberFormat.UInt8LE = 0;

        newData = getreg(LSM9DS1_AG_I2C_ADDRESS, STATUS_REG_A);

        if (newData & ACC_READY) {
            // Get X data
            data = getInt8LE(LSM9DS1_AG_I2C_ADDRESS, OUT_X_H_XL);
            data <<= 8;
            data |= getreg(LSM9DS1_AG_I2C_ADDRESS, OUT_X_L_XL);
            aX = data * sensitivity.accel;
            data = 0;

            // get Y data
            data = getInt8LE(LSM9DS1_AG_I2C_ADDRESS, OUT_Y_H_XL);
            data <<= 8;
            data |= getreg(LSM9DS1_AG_I2C_ADDRESS, OUT_Y_L_XL);
            aY = data * sensitivity.accel;
            data = 0;

            // get Z data
            data = getInt8LE(LSM9DS1_AG_I2C_ADDRESS, OUT_Z_H_XL);
            data <<= 8;
            data |= getreg(LSM9DS1_AG_I2C_ADDRESS, OUT_Z_L_XL);
            aZ = data * sensitivity.accel;
        }
    }

    //Read Magnotomer Data
    function readMag() {
        let data: NumberFormat.Int16LE = 0;
        let newData: NumberFormat.UInt8LE = 0;

        newData = getreg(LSM9DS1_M_I2C_ADDRESS, STATUS_REG_M);

        if (newData & MAG_READY) {
            data = getInt8LE(LSM9DS1_M_I2C_ADDRESS, OUT_X_H_M);
            data <<= 8;
            data |= getreg(LSM9DS1_M_I2C_ADDRESS, OUT_X_L_M);
            mX = data * sensitivity.mag;
            data = 0;

            data = getInt8LE(LSM9DS1_M_I2C_ADDRESS, OUT_Y_H_M);
            data <<= 8;
            data |= getreg(LSM9DS1_M_I2C_ADDRESS, OUT_Y_L_M);
            mY = data * sensitivity.mag;
            data = 0;

            data = getInt8LE(LSM9DS1_M_I2C_ADDRESS, OUT_Z_H_M);
            data <<= 8;
            data |= getreg(LSM9DS1_M_I2C_ADDRESS, OUT_Z_L_M);
            mZ = data * sensitivity.mag;
        }
    }


    let gyro = new structGyroscope()
    let accel = new structAccelromter()
    let mag = new structMagnotomer()
    let temp = new structTemperature()
    let sensitivity = new structSensitivity()

    gX = mX = aX = 0
    gY = mY = aY = 0
    gZ = mZ = mZ = 0

    //init sensor
    gyro.scale = 0x00;
    gyro.bandwidth = 0x00;
    gyro.sampleRate = 0xC0;
    gyro.lowpower = false;
    gyro.HPF = false;
    gyro.HPF_CutOFF = false;
    gyro.enable_axis = 0x38;
    gyro.latchedIRQ = 0x02;

    accel.scale = 0x00;
    accel.bandwidth = 0x00;
    accel.sampleRate = 0xC0;
    accel.enable_axis = 0x38;
    accel.lowpower = false;

    mag.scale = 0x00;
    mag.bandwidth = 0x80;
    mag.sampleRate = 0x1C;
    mag.performanceXY = 0x60;
    mag.performanceZ = 0x0C;
    mag.mode = 0x00;
    mag.lowpower = false;
    mag.enable_axis = 0x00;
    mag.fast_read = 0x00;
    mag.BDU = 0x00;

    temp.enabled = true;

    sensitivity.setSensitivity(LSM9DS1_ACCEL_MG_LSB_2G, LSM9DS1_GYRO_DPS_DIGIT_245DPS, LSM9DS1_MAG_MGAUSS_4GAUSS)
    if (WHO_AM_I() == 0x683D)
        SI01_ACK = true

    if (SI01_ACK) {
        mag.setupMag()
        gyro.setupGyro()
        accel.setupAccel()
    }

    //% blockId="getGyro"
    //% block="SI01 get gyro %u"
    export function getGyro(dim: GYRO): number {

        if (dim == GYRO.GX)
            return gX
        else if (dim == GYRO.GY)
            return gY
        else if (dim == GYRO.GZ)
            return gZ

        return 0
    }

    //% blockId="getAccel"
    //% block="SI01 get acceleration %u"
    export function getAccel(dim: ACCEL): NumberFormat.Int16LE {

        if (dim == ACCEL.AX) {
            return aX
        }
        else if (dim == ACCEL.AY) {
            return aY
        }
        else if (dim == ACCEL.AZ) {
            return aZ
        }

        return 0
    }

    //% blockId="getMag"
    //% block="SI01 get magnetic field %u"
    export function getMag(dim: MAG): number {
        if (dim == MAG.MX)
            return mX
        else if (dim == MAG.MY)
            return mY
        else if (dim == MAG.MZ)
            return mZ

        return 0
    }

    //% blockId="poll"
    //% block="SI01 poll sensor"
    export function poll() {
        basic.pause(10)
        if(SI01_ACK)
        {
        readAccel()
        /*readGyro()
        readMag()*/
        }
    }
} 