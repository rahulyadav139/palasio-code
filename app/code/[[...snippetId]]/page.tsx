import { Box } from '@mui/material';
import { Snippet } from '@/components/Snippet';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

const getData = async (host: string, id: string) => {
  try {
    const res = await fetch(`http://${host}/api/code/${id}/`);

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

interface ICode {
  params: {
    snippetId?: string[];
  };
}

export default async function Code({ params }: ICode) {
  let initialData: any;
  const host = headers().get('host');

  if (params.snippetId && params.snippetId.length > 1) {
    redirect('/code');
  } else if (params.snippetId) {
    const id = params.snippetId[0];

    const { snippet, error } = await getData(host!, id);

    if (error || !snippet) {
      redirect('/');
    } else {
      initialData = snippet;
    }
  }

  return (
    <Box>
      <Snippet snippet={initialData} />
    </Box>
  );
}
