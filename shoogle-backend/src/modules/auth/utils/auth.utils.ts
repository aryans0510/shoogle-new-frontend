import { env, prisma } from "@shared/index";
import { google } from "googleapis";

export const createTruecallerUser = async (data: any) => {
  return await prisma.user.create({
    data: {
      name: `${data.name?.first} ${data.name?.last}`,
      email: data.onlineIdentities?.email,
      phone: data.phoneNumbers[0]?.toString(),
      last_sign_in: new Date(),
      address: data.addresses[0]?.city,
      identities: {
        connectOrCreate: {
          where: {
            provider_id_provider: { provider_id: data.id, provider: "truecaller" },
          },
          create: { provider_id: data.id, provider: "truecaller" },
        },
      },
    },
    include: {
      seller_profile: true,
    },
  });
};

export const googleClient = () => {
  return new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_CALLBACK_URL
  );
};
