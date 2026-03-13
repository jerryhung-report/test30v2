import { FUND_MAPPING, MOCK_FUNDS } from './utils/constants';

const fundMap: Record<string, string> = {};
MOCK_FUNDS.forEach(f => { fundMap[f.code] = f.name; });

let md = '| 基金人格 | 核心配置 (Core) | 衛星配置 (Satellite) | ETF |\n';
md += '|---|---|---|---|\n';

for (const [persona, data] of Object.entries(FUND_MAPPING)) {
  const coreNames = data.core.map(c => fundMap[c] || c).join('<br>');
  const satNames = data.sat.map(c => fundMap[c] || c).join('<br>');
  const etfName = fundMap[data.etf] || data.etf;
  md += `| ${persona} | ${coreNames} | ${satNames} | ${etfName} |\n`;
}

console.log(md);
