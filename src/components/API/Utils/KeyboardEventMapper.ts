class KeyboardEventMapper {
    public isEscape = (e: KeyboardEvent) => {
        return e.keyCode === 27;
    }

    public isQ = (e: KeyboardEvent) => {
        return e.keyCode === 81;
    }

    public isW = (e: KeyboardEvent) => {
        return e.keyCode === 87;
    }

    public isDelete = (e: KeyboardEvent) => {
        return (e.keyCode === 8 || e.keyCode === 46 || e.keyCode === 127);
    }

    public isArrow = (e: KeyboardEvent) => {
        return e.code.includes('Arrow');
    }

    public isCtrlA = (e: KeyboardEvent) => {
        return e.ctrlKey && e.keyCode === 65;
    }

    public isCtrlZ = (e: KeyboardEvent) => {
        return e.ctrlKey && e.keyCode === 90;
    }

    public isCtrlY = (e: KeyboardEvent) => {
        return e.ctrlKey && e.keyCode === 89;
    }

    public isCtrlD = (e: KeyboardEvent) => {
        return e.ctrlKey && e.keyCode === 68;
    }

    public isPlus = (e: KeyboardEvent) => {
        return e.keyCode === 187;
    }

    public isMinus = (e: KeyboardEvent) => {
        return e.keyCode === 189;
    }

    public isO = (e: KeyboardEvent) => {
        return e.keyCode === 79;
    }

    public isP = (e: KeyboardEvent) => {
        return e.keyCode === 80;
    }
}

export default KeyboardEventMapper;
