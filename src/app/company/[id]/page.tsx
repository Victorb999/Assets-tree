import { returnAssets, returnLocations } from "@/services/apiTractian";

interface PageProps {
  params: { id: string };
}

export default async function CustomersPage({ params }: PageProps) {
  const companies = await returnLocations(params.id);
  const assets = await returnAssets(params.id);

  return (
    <div className="p-4 flex">
      <div>
        <h1>Locations</h1>

        <pre>{JSON.stringify(companies, null, 2)}</pre>
      </div>
      <div>
        <h1>Assets</h1>

        <pre>{JSON.stringify(assets, null, 2)}</pre>
      </div>
    </div>
  );
}
