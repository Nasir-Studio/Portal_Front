import type { Program } from '$ntub/types';
import { corporateSustainability } from './programs/corporate-sustainability';
import { innovationEntrepreneurship } from './programs/innovation-entrepreneurship';
import { foreignBusiness } from './programs/foreign-business';
import { bigData } from './programs/big-data';
import { digitalMarketing } from './programs/digital-marketing';
import { digitalMarketingLangTech } from './programs/digital-marketing-lang-tech';
import { dataAnalysisVisualization } from './programs/data-analysis-visualization';
import { socialMediaMarketing } from './programs/social-media-marketing';
import { eastAsiaLanguageBusiness } from './programs/east-asia-language-business';

export const programs: Program[] = [
	corporateSustainability,
	innovationEntrepreneurship,
	foreignBusiness,
	bigData,
	digitalMarketing,
	digitalMarketingLangTech,
	dataAnalysisVisualization,
	socialMediaMarketing,
	eastAsiaLanguageBusiness
];

export function getProgram(id: string): Program | undefined {
	return programs.find((p) => p.id === id);
}
