import { samples } from './samples';
export type SampleLayout = 'a'|'b';
export function samplesForLayout(layout:SampleLayout){return samples.map(sample=>({...sample,available:sample.available,href:`/samples/${layout}/${sample.theme}/` }));}
