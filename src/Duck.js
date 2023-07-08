export class Duck{
    constructor(color){
        const spriteW = 375.0;
        const spriteH = 267.0;

        const initialX = color*120.0/spriteW;
        const initialY = 112.0/spriteH;

        const texW = 40.0/spriteW;
        const texH = 40.0/spriteH;

        this.states = [];

        // v_texCoord = vec2((a_texCoord.x/375.0)*40.0, (112.0/267.0)+(a_texCoord.y/267.0)*40.0);

        for (let i = 0; i < 4; i++) {
            this.states.push([]);
            for (let j = 0; j < 3; j++) {
                this.states[i].push( [initialX + j*texW, initialY + i*texH] );
            }
            this.states[i].push( [initialX + texW, initialY + i*texH] );
        }

    }
}