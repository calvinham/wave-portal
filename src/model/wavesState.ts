import { Wave } from './wave';

export interface WavesState {
	waves: Wave[];
	loading: number;
	totalWaves: number;
}
