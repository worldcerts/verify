import { isValid, verify } from "../src";
import {
  documentWithOneCertificateStoreIssuerInRegistry,
  documentWithOneCertificateStoreIssuerNotInRegistry,
  documentWithOneDocumentStoreIssuerInRegistryAndInvalidDnsTxt,
  documentWithOneDocumentStoreIssuerInRegistryAndValidDnsTxt,
  documentWithOneDocumentStoreIssuerNotInRegistryAndInvalidDnsTxt,
  documentWithOneDocumentStoreIssuerNotInRegistryAndValidDnsTxt,
  documentWithTwoCertificateStoreIssuerInRegistry,
  documentWithTwoCertificateStoreIssuerNotInRegistry,
  documentWithTwoCertificateStoreIssuerWithOneInRegistry,
  documentWithTwoDocumentStoreIssuerInRegistryWithValidDnsTxt,
  documentWithTwoDocumentStoreIssuerOneInRegistryWithValidDnsTxtAndSecondInvalid,
  documentWithTwoDocumentStoreIssuerNotInRegistryWithoutValidDnsTxt,
  documentMainnetValidWithCertificateStore
} from "./fixtures/v2/document";

const options = { network: "ropsten" };
describe("verify", () => {
  it("should be valid for all checks when document with certificate store is valid on mainnet", async () => {
    const fragments = await verify(documentMainnetValidWithCertificateStore, {
      network: "homestead"
    });
    expect(fragments).toStrictEqual([
      {
        data: true,
        status: "VALID",
        name: "OpenAttestationHash",
        type: "DOCUMENT_INTEGRITY"
      },
      {
        data: {
          details: [
            {
              address: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
              issued: true
            }
          ],
          issuedOnAll: true
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreIssued",
        type: "DOCUMENT_STATUS"
      },
      {
        message: 'Document issuers doesn\'t have "tokenRegistry" property or TOKEN_REGISTRY method',
        name: "OpenAttestationEthereumTokenRegistryMinted",
        status: "SKIPPED",
        type: "DOCUMENT_STATUS"
      },
      {
        data: {
          details: [
            {
              address: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
              revoked: false
            }
          ],
          revokedOnAny: false
        },
        status: "VALID",
        name: "OpenAttestationEthereumDocumentStoreRevoked",
        type: "DOCUMENT_STATUS"
      },
      {
        message: `Document issuers doesn't have "documentStore" / "tokenRegistry" property or doesn't use DNS-TXT type`,
        status: "SKIPPED",
        name: "OpenAttestationDnsTxt",
        type: "ISSUER_IDENTITY"
      },
      {
        data: [
          {
            displayCard: true,
            email: "info@tech.gov.sg",
            id: "govtech-registry",
            logo: "/static/images/GOVTECH_logo.png",
            name: "Government Technology Agency of Singapore (GovTech)",
            phone: "+65 6211 2100",
            status: "VALID",
            value: "0x007d40224f6562461633ccfbaffd359ebb2fc9ba",
            website: "https://www.tech.gov.sg"
          }
        ],
        message: undefined,
        name: "OpencertsRegistryVerifier",
        status: "VALID",
        type: "ISSUER_IDENTITY"
      }
    ]);
    expect(isValid(fragments)).toStrictEqual(true);
  });
  describe("IDENTITY_ISSUER", () => {
    describe("single issuer with certificate store", () => {
      it("should have valid ISSUER_IDENTITY when document has one issuer that is in registry", async () => {
        const fragments = await verify(documentWithOneCertificateStoreIssuerInRegistry, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has one issuer that is not in registry", async () => {
        const fragments = await verify(documentWithOneCertificateStoreIssuerNotInRegistry, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
    describe("single issuer with document store and DNS-TXT", () => {
      it("should have valid ISSUER_IDENTITY when document has one issuer that is in registry and a valid DNS-TXT record", async () => {
        const fragments = await verify(documentWithOneDocumentStoreIssuerInRegistryAndValidDnsTxt, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has one issuer that is not in registry and a valid DNS-TXT record", async () => {
        const fragments = await verify(documentWithOneDocumentStoreIssuerNotInRegistryAndValidDnsTxt, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has one issuer that is in registry and a invalid DNS-TXT record", async () => {
        const fragments = await verify(documentWithOneDocumentStoreIssuerInRegistryAndInvalidDnsTxt, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has one issuer that is not in registry and a invalid DNS-TXT record", async () => {
        const fragments = await verify(documentWithOneDocumentStoreIssuerNotInRegistryAndInvalidDnsTxt, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
    describe("multiple issuer with certificate store", () => {
      it("should have valid ISSUER_IDENTITY when document has two issuers that are in registry", async () => {
        const fragments = await verify(documentWithTwoCertificateStoreIssuerInRegistry, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has two issuers and only one is in registry", async () => {
        const fragments = await verify(documentWithTwoCertificateStoreIssuerWithOneInRegistry, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has two issuers and none is in registry", async () => {
        const fragments = await verify(documentWithTwoCertificateStoreIssuerNotInRegistry, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
    describe("multiple issuer with document store and DNS-TXT", () => {
      it("should have valid ISSUER_IDENTITY when document has two issuers that are in registry with valid dns-txt", async () => {
        const fragments = await verify(documentWithTwoDocumentStoreIssuerInRegistryWithValidDnsTxt, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have valid ISSUER_IDENTITY when document has two issuers, one that is in registry with valid dns-txt and the other being invalid", async () => {
        const fragments = await verify(
          documentWithTwoDocumentStoreIssuerOneInRegistryWithValidDnsTxtAndSecondInvalid,
          options
        );
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(true);
      });
      it("should have invalid ISSUER_IDENTITY when document has two issuers, none are in registry and both without valid DNS", async () => {
        const fragments = await verify(documentWithTwoDocumentStoreIssuerNotInRegistryWithoutValidDnsTxt, options);
        expect(isValid(fragments, ["ISSUER_IDENTITY"])).toStrictEqual(false);
      });
    });
  });
});