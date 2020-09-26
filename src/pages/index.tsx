import styled from '@emotion/styled';
import Head from 'next/head';
import { ReactElement } from 'react';

const Container = styled.div`
	min-height: 100vh;
	padding: 0 0.5rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Main = styled.main`
	padding: 5rem 0;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Footer = styled.footer`
	width: 100%;
	height: 100px;
	border-top: 1px solid #eaeaea;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const FooterImage = styled.img`
	margin-left: 0.5rem;
	height: 1em;
`;

const FooterLink = styled.a`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Title = styled.h1`
	margin: 0;
	line-height: 1.15;
	font-size: 4rem;
	text-align: center;
`;

const TitleLink = styled.a`
	color: #0070f3;
	text-decoration: none;

	&:hover,
	&:focus,
	&:active {
		text-decoration: underline;
	}
`;

const Description = styled.p`
	line-height: 1.5;
	font-size: 1.5rem;
	text-align: center;
`;

const Code = styled.code`
	background: #fafafa;
	border-radius: 5px;
	padding: 0.75rem;
	font-size: 1.1rem;
	font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New,
		monospace;
`;

const Grid = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;

	max-width: 800px;
	margin-top: 3rem;

	@media (max-width: 600px) {
		width: 100%;
		flex-direction: column;
	}
`;

const Card = styled.a`
	margin: 1rem;
	flex-basis: 45%;
	padding: 1.5rem;
	text-align: left;
	color: inherit;
	text-decoration: none;
	border: 1px solid #eaeaea;
	border-radius: 10px;
	transition: color 0.15s ease, border-color 0.15s ease;

	&:hover,
	&:focus,
	&:active {
		color: #0070f3;
		border-color: #0070f3;
	}
`;

const CardTitle = styled.h3`
	margin: 0 0 1rem 0;
	font-size: 1.5rem;
`;

const CardContent = styled.p`
	margin: 0;
	font-size: 1.25rem;
	line-height: 1.5;
`;

export default function Home(): ReactElement {
	return (
		<Container>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Main>
				<Title>
					Welcome to <TitleLink href="https://nextjs.org">Next.js!</TitleLink>
				</Title>

				<Description>
					Get started by editing <Code>pages/index.js</Code>
				</Description>

				<Grid>
					<Card href="https://nextjs.org/docs">
						<CardTitle>Documentation &rarr;</CardTitle>
						<CardContent>Find in-depth information about Next.js features and API.</CardContent>
					</Card>

					<Card href="https://nextjs.org/learn">
						<CardTitle>Learn &rarr;</CardTitle>
						<CardContent>Learn about Next.js in an interactive course with quizzes!</CardContent>
					</Card>

					<Card href="https://github.com/vercel/next.js/tree/master/examples">
						<CardTitle>Examples &rarr;</CardTitle>
						<CardContent>Discover and deploy boilerplate example Next.js projects.</CardContent>
					</Card>

					<Card href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app">
						<CardTitle>Deploy &rarr;</CardTitle>
						<CardContent>Instantly deploy your Next.js site to a public URL with Vercel.</CardContent>
					</Card>
				</Grid>
			</Main>

			<Footer>
				<FooterLink
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					Powered by <FooterImage src="/vercel.svg" alt="Vercel Logo" />
				</FooterLink>
			</Footer>
		</Container>
	);
}
