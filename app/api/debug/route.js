import { getCompanyBySlug } from '../../../lib/actions/companies';

export async function GET() {
  const company = await getCompanyBySlug('soulix');
  return Response.json({ company: company || 'Not Found' });
}
