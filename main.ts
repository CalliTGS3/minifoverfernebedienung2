input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    Fahren = true
    basic.setLedColor(0x00ff00)
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    Fahren = false
    basic.turnRgbLedOff()
})
let MotorRechts = 0
let MotorLinks = 0
let BremseRechts = 0
let BremseLinks = 0
let Geschwindigkeit = 0
let LedY = 0
let LedX = 0
let NeigungY = 0
let NeigungX = 0
let Fahren = false
let NeigungMax = 30
let MotorMinimum = 70
radio.setGroup(1)
basic.turnRgbLedOff()
serial.redirectToUSB()
basic.forever(function () {
    if (Fahren) {
        NeigungX = input.rotation(Rotation.Roll)
        NeigungY = input.rotation(Rotation.Pitch)
        NeigungX = Math.constrain(NeigungX, NeigungMax * -1, NeigungMax)
        NeigungY = Math.constrain(NeigungY, NeigungMax * -1, NeigungMax)
        led.unplot(LedX, LedY)
        LedX = Math.map(NeigungX, NeigungMax * -1, NeigungMax, 0, 4)
        LedY = Math.map(NeigungY, NeigungMax * -1, NeigungMax, 0, 4)
        led.plot(LedX, LedY)
        Geschwindigkeit = Math.map(NeigungY, NeigungMax * -1, NeigungMax, 100, MotorMinimum)
        serial.writeValue("G", Geschwindigkeit)
        if (NeigungX < 0) {
            BremseLinks = Math.map(NeigungX, 0, NeigungMax * -1, 0, Geschwindigkeit - MotorMinimum)
        } else {
            BremseLinks = 0
        }
        serial.writeValue("BL", BremseLinks)
        if (NeigungX > 0) {
            BremseRechts = Math.map(NeigungX, 0, NeigungMax, 0, Geschwindigkeit - MotorMinimum)
        } else {
            BremseRechts = 0
        }
        serial.writeValue("BR", BremseRechts)
        MotorLinks = Geschwindigkeit - BremseLinks
        MotorRechts = Geschwindigkeit - BremseRechts
        serial.writeValue("L", MotorLinks)
        serial.writeValue("R", MotorRechts)
        radio.sendValue("F", 1)
        radio.sendValue("R", MotorRechts)
        radio.sendValue("L", MotorLinks)
        radio.sendValue("X", LedX)
        radio.sendValue("Y", LedY)
        basic.pause(50)
    } else {
        radio.sendValue("F", 0)
        basic.clearScreen()
    }
})
