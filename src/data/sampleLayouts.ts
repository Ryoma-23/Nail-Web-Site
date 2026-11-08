import { samples } from './samples';
export type SampleLayout = 'a'|'b';
export function samplesForLayout(layout:SampleLayout){return samples.map(sample=>({...sample,available:layout==='a'?sample.available:sample.theme==='natural',href:`/samples/${layout}/${sample.theme}/` }));}
