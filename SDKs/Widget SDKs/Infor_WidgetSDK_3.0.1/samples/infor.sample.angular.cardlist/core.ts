export interface ICardItem {
	title: string;
	description: string;
}

export const mockData: ICardItem[] = [
	{
		title: "Stock level 31-22",
		description: "Stocklevel has reached 100 items",
	},
	{
		title: "Customer returns",
		description: "Customer returns has increased with 10%",
	},
	{
		title: "Customer approved",
		description: "Customer Hulk Holding has been approved.",
	},
	{
		title: "Stock level Chair-3",
		description: "WHLO 200 has 500 items",
	},
	{
		title: "Planned machine maintenance",
		description: "Planned time",
	},
	{
		title: "Incoming order",
		description: "New order from customer Hulk Holding",
	},
	{
		title: "Expiring contract",
		description: "Contrach #12345 expires in 22 days",
	},
];
