# Projeyi zip halinde hazırlamak için temiz bir `page.tsx` dosyası oluşturuyoruz

page_tsx_code = """
import { cookies } from 'next/headers';
import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '../(auth)/auth';
import { redirect } from 'next/navigation';

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect('/api/auth/guest');
  }

  const id = generateUUID();
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');
  const chatModel = modelIdFromCookie?.value || DEFAULT_CHAT_MODEL;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2">🐯 TigerCal</h1>
      <p className="text-center text-gray-500 mb-6">
        Your AI-powered life coach. Ask anything, anytime.
      </p>

      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        initialChatModel={chatModel}
        initialVisibilityType="private"
        isReadonly={false}
        session={session}
        autoResume={false}
        showInSidebar={true}
        streamComponent={DataStreamHandler}
      />
    </main>
  );
}
"""

from pathlib import Path
import zipfile

# Dosya yapısı oluşturuluyor
base_path = Path("/mnt/data/tigercal_clean_page")
file_path = base_path / "app" / "(chat)"
file_path.mkdir(parents=True, exist_ok=True)

# Dosyayı kaydet
with open(file_path / "page.tsx", "w", encoding="utf-8") as f:
    f.write(page_tsx_code.strip())

# Zip dosyasını oluştur
zip_path = Path("/mnt/data/tigercal_fixed_page.zip")
with zipfile.ZipFile(zip_path, "w") as zipf:
    for file in file_path.rglob("*"):
        zipf.write(file, file.relative_to(base_path))

zip_path
