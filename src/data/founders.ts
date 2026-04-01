export interface FounderType {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
  linkedin?: string;
}

export const foundersData: FounderType[] = [
  {
    id: "bk-soni",
    name: "B.K. Soni",
    title: "Chairman & Managing Director",
    image: "https://placehold.co/200x200?text=B.K.+Soni",
    bio: "B.K. Soni is the Chairman and Managing Director of Eco Recycling Ltd (Ecoreco) and the chief promoter of the group. Under Mr. Soni's stewardship the company has attained a leadership position as India's foremost e-waste management company with a dominant pan-India market presence. He is responsible for the strategic growth initiatives of the company and building a professional team of leaders. After delivering market dominance in the B2B segment, Mr. Soni is driving Ecoreco's next phase of growth, building a B2C franchisee led retail model to share the benefits of alarming but unfolding opportunity of e-waste management with all the stakeholders in one or the other form.",
  },
  {
    id: "shashank-soni",
    name: "Shashank Soni",
    title: "Director",
    image: "https://placehold.co/200x200?text=Shashank+Soni",
    bio: "Shashank Soni is an Executive Director of Ecoreco. Shashank is responsible for developing and rolling out a pan-India marketing and sales strategy for the company. He oversees the de-manufacturing & factory operations and also looks into commercial negotiations. With rich exposure to international markets, Mr. Shashank is leading Ecoreco's transformation into an integrated pan-India e-waste management company. Mr. Shashank holds an MBA from Cardiff University, UK and holds a Bachelor of Commerce degree from Narsee Monjee Institute of Management Studies (NMIMS). Having travelled extensively, he has been part of industry events like Computex Taipei, Taiwan and various other conferences and events across Europe and Asia.",
  },
];

