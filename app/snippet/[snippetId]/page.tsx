import { Snippet } from '@/components/Snippet';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ISnippet } from '@/types/ISnippet';
import NotFound from '@/app/not-found';

const getData = async (host: string, id: string) => {
  try {
    const res = await fetch(`http://${host}/api/snippet/${id}/`);

    if (!res.ok) {
      throw new Error('something went wrong');
    }

    const json = await res.json();

    return { snippet: json.snippet, error: false };
  } catch (err) {
    console.log(err);
    return { snippet: null, error: true };
  }
};

interface ISnippetPage {
  params: {
    snippetId: string;
  };
}

export default async function SnippetPage({ params }: ISnippetPage) {
  let initialData: ISnippet;
  const host = headers().get('host');

  const id = params.snippetId;

  const { snippet, error } = await getData(host!, id);

  if (!snippet) {
    return <NotFound />;
  }

  if (error) {
    redirect('/');
  }
  initialData = snippet;

  return <Snippet snippet={initialData} />;
}
