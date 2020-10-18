import { Handler } from '..';
import { clamp } from 'lodash';

import { Blueprint } from '..';

export interface WorkspaceEvent<T extends any = Event> {
    e: T;
    current?: Blueprint;
    activeBlueprint?: Blueprint;
    blueprints?: Blueprint[];
    activeIndex?: number;
    removeIndex?: number;
}

class HelperWorkspace {
    private _handler: Handler;
    private _blueprints: Blueprint[];
    private _activeBlueprint: Blueprint;
    private _loaded: boolean;

    constructor(handler: Handler) {
        this._handler = handler;
        this._blueprints = [];
        this._activeBlueprint = null;
        this._loaded = false;
    }

    public loadJSON = (json: any) => {
        this._loaded = false;

        if (typeof json === 'string') {
            json = JSON.parse(json);
        }

        json.forEach(obj => {
            const blueprint = new Blueprint(this._handler);
            blueprint.init(obj);
            this._blueprints.push(blueprint);
        });

        if (!this._blueprints.length) {
            this.addAsActiveBlueprint();
        } else {
            this.loadBlueprint(0);
        }
    }

    public addBlueprint = (obj?: any) => {
        const blueprint = new Blueprint(this._handler);
        blueprint.init(obj);
        this._blueprints.push(blueprint);
        this._handler.trigger('blueprint:add', {
            blueprints: this._blueprints,
            activeBlueprint: this._activeBlueprint,
            current: blueprint,
            activeIndex: this.activeBlueprintIndex(),
            removeIndex: -1
        } as WorkspaceEvent);
    };

    public addAsActiveBlueprint = (obj?: any) => {
        this.addBlueprint(obj);
        this.loadBlueprint();
    };

    public removeBlueprint = (index: number) => {
        if (index < 0 || index > this._blueprints.length - 1) return;
        this.removeBlueprintById(this._blueprints[index].id());
    }

    public removeBlueprintById = (id: string) => {
        if (this._blueprints.length < 2) return;

        const removeIndex = this._blueprints.findIndex((bp => bp.id() === id));
        this._blueprints = this._blueprints.filter(bp => bp.id() !== id);

        this._handler.trigger('blueprint:remove', {
            blueprints: this._blueprints,
            activeBlueprint: this._activeBlueprint,
            current: this._activeBlueprint,
            activeIndex: this.activeBlueprintIndex(),
            removeIndex: removeIndex
        } as WorkspaceEvent);
    }

    public loadBlueprint = (index: number = this._blueprints.length - 1) => {
        index = clamp(index, 0, this._blueprints.length - 1);
        if (index === this.activeBlueprintIndex()) return;

        this._activeBlueprint?.unload(true);
        this._activeBlueprint = this._blueprints[index];
        this._activeBlueprint?.load(() => {
            this._handler.trigger('blueprint:load', {
                blueprints: this._blueprints,
                activeBlueprint: this._activeBlueprint,
                current: this._activeBlueprint,
                activeIndex: this.activeBlueprintIndex(),
                removeIndex: -1
            } as WorkspaceEvent);

            if (!this._loaded) {
                this._handler.trigger('workspace:loaded', {
                    blueprints: this._blueprints,
                    activeBlueprint: this._activeBlueprint,
                    current: this._activeBlueprint,
                    activeIndex: this.activeBlueprintIndex(),
                    removeIndex: -1
                } as WorkspaceEvent);
                this._loaded = true;
            }
        });
    }

    public loadBlueprintById = (id: string) => {
        if (this._activeBlueprint && this._activeBlueprint.id() === id) return;

        const index = this._blueprints.indexOf(this._blueprints.find(bp => bp.id() === id));
        this.loadBlueprint(index);
    }

    public serialize = (): string => {
        let target = []
        this._activeBlueprint.commit();
        this._blueprints.forEach(blueprint => {
            target.push(blueprint.serialize());
        });

        return JSON.stringify(target);
    }

    public blueprints = (): Blueprint[] => this._blueprints;
    public activeBlueprint = (): Blueprint => this._activeBlueprint;
    public activeBlueprintIndex = (): number => this._blueprints.indexOf(this._activeBlueprint);
}

export default HelperWorkspace;
