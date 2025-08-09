import * as React from "react";
import Head from "next/head";

interface PasswordChangeNotificationEmailProps {
  userName: string;
  userEmail: string;
  changeDate: string;
  supportUrl: string;
  locale: string;
}

const translations = {
  en: {
    preview: "Your password has been changed",
    greeting: "Hello",
    title: "Password Change Notification",
    message1:
      "This is to inform you that your password has been successfully changed.",
    changeDateLabel: "Change date:",
    message2: "If you made this change, no further action is required.",
    message3:
      "If you did not request this change, your account may have been compromised. Please contact our support team immediately.",
    buttonText: "Contact Support",
    message4: "For your security, we recommend:",
    recommendation1: "• Reviewing your recent account activity",
    recommendation2:
      "• Enabling two-factor authentication if not already active",
    recommendation3: "• Using a unique, strong password for your account",
    footer: "Best regards,\nThe NextintelBetterAuth Team",
  },
  fr: {
    preview: "Votre mot de passe a été modifié",
    greeting: "Bonjour",
    title: "Notification de Changement de Mot de Passe",
    message1:
      "Nous vous informons que votre mot de passe a été modifié avec succès.",
    changeDateLabel: "Date du changement :",
    message2:
      "Si vous avez effectué ce changement, aucune action supplémentaire n'est requise.",
    message3:
      "Si vous n'avez pas demandé ce changement, votre compte pourrait être compromis. Veuillez contacter notre équipe de support immédiatement.",
    buttonText: "Contacter le Support",
    message4: "Pour votre sécurité, nous recommandons :",
    recommendation1: "• Vérifier l'activité récente de votre compte",
    recommendation2:
      "• Activer l'authentification à deux facteurs si ce n'est pas déjà fait",
    recommendation3:
      "• Utiliser un mot de passe unique et fort pour votre compte",
    footer: "Cordialement,\nL'équipe NextintelBetterAuth",
  },
};

export function PasswordChangeNotificationEmail({
  userName,
  userEmail,
  changeDate,
  supportUrl,
  locale,
}: PasswordChangeNotificationEmailProps) {
  const t =
    translations[locale as keyof typeof translations] || translations.en;

  return (
    <html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>{t.title}</title>
        <style>{`
          @media only screen and (max-width: 620px) {
            table.body h1 {
              font-size: 28px !important;
              margin-bottom: 10px !important;
            }
            table.body p,
            table.body ul,
            table.body ol,
            table.body td,
            table.body span,
            table.body a {
              font-size: 16px !important;
            }
            table.body .wrapper,
            table.body .article {
              padding: 10px !important;
            }
            table.body .content {
              padding: 0 !important;
            }
            table.body .container {
              padding: 0 !important;
              width: 100% !important;
            }
            table.body .main {
              border-left-width: 0 !important;
              border-radius: 0 !important;
              border-right-width: 0 !important;
            }
            table.body .btn table {
              width: 100% !important;
            }
            table.body .btn a {
              width: 100% !important;
            }
            table.body .img-responsive {
              height: auto !important;
              max-width: 100% !important;
              width: auto !important;
            }
          }
          @media all {
            .ExternalClass {
              width: 100%;
            }
            .ExternalClass,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass font,
            .ExternalClass td,
            .ExternalClass div {
              line-height: 100%;
            }
            .apple-link a {
              color: inherit !important;
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              text-decoration: none !important;
            }
            #MessageViewBody a {
              color: inherit;
              text-decoration: none;
              font-size: inherit;
              font-family: inherit;
              font-weight: inherit;
              line-height: inherit;
            }
            .btn-primary table td:hover {
              background-color: #34495e !important;
            }
            .btn-primary a:hover {
              background-color: #34495e !important;
              border-color: #34495e !important;
            }
          }
        `}</style>
      </Head>
      <body
        style={{
          backgroundColor: "#f6f6f6",
          fontFamily: "sans-serif",
          WebkitFontSmoothing: "antialiased",
          fontSize: "14px",
          lineHeight: "1.4",
          margin: "0",
          padding: "0",
          textSizeAdjust: "100%",
          WebkitTextSizeAdjust: "100%",
        }}
      >
        <span
          style={{
            color: "transparent",
            display: "none",
            height: "0",
            maxHeight: "0",
            maxWidth: "0",
            opacity: "0",
            overflow: "hidden",
            textSizeAdjust: "100%",
            visibility: "hidden",
            width: "0",
          }}
        >
          {t.preview}
        </span>
        <table
          role="presentation"
          style={{
            backgroundColor: "#f6f6f6",
            width: "100%",
            borderCollapse: "separate",
            textSizeAdjust: "100%",
            WebkitTextSizeAdjust: "100%",
          }}
          className="body"
        >
          <tr>
            <td
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                verticalAlign: "top",
              }}
            >
              &nbsp;
            </td>
            <td
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                verticalAlign: "top",
                display: "block",
                margin: "0 auto",
                maxWidth: "580px",
                padding: "10px",
                width: "580px",
              }}
              className="container"
            >
              <div
                style={{
                  boxSizing: "border-box",
                  display: "block",
                  margin: "0 auto",
                  maxWidth: "580px",
                  padding: "10px",
                }}
                className="content"
              >
                {/* START CENTERED WHITE CONTAINER */}
                <table
                  role="presentation"
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "3px",
                    width: "100%",
                    borderCollapse: "separate",
                    textSizeAdjust: "100%",
                    WebkitTextSizeAdjust: "100%",
                  }}
                  className="main"
                >
                  {/* HEADER WITH LOGO */}
                  <tr>
                    <td
                      style={{
                        backgroundColor: "#1f2937",
                        padding: "32px 24px",
                        textAlign: "center",
                        fontFamily: "sans-serif",
                        fontSize: "14px",
                        verticalAlign: "top",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="https://res.cloudinary.com/dvc22eldv/image/upload/v1753544352/logo_zq36nx.png"
                        alt="NextintelBetterAuth Logo"
                        style={{
                          height: "40px",
                          width: "auto",
                          marginBottom: "8px",
                          display: "block",
                          margin: "0 auto 8px auto",
                        }}
                      />
                      <h1
                        style={{
                          color: "#ffffff",
                          fontSize: "24px",
                          fontWeight: "bold",
                          margin: 0,
                          textAlign: "center",
                          fontFamily: "sans-serif",
                        }}
                      >
                        NextintelBetterAuth
                      </h1>
                    </td>
                  </tr>
                  {/* START MAIN CONTENT AREA */}
                  <tr>
                    <td
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "14px",
                        verticalAlign: "top",
                        boxSizing: "border-box",
                        padding: "20px",
                      }}
                      className="wrapper"
                    >
                      <table
                        role="presentation"
                        style={{
                          width: "100%",
                          borderCollapse: "separate",
                          textSizeAdjust: "100%",
                          WebkitTextSizeAdjust: "100%",
                        }}
                      >
                        <tr>
                          <td
                            style={{
                              fontFamily: "sans-serif",
                              fontSize: "14px",
                              verticalAlign: "top",
                            }}
                          >
                            <h1
                              style={{
                                color: "#000000",
                                fontFamily: "sans-serif",
                                fontSize: "24px",
                                fontWeight: "300",
                                lineHeight: "1.4",
                                margin: "0",
                                marginBottom: "15px",
                                textAlign: "center",
                              }}
                            >
                              🔒 {t.title}
                            </h1>
                            <p
                              style={{
                                fontFamily: "sans-serif",
                                fontSize: "14px",
                                fontWeight: "normal",
                                margin: "0",
                                marginBottom: "15px",
                              }}
                            >
                              {t.greeting} {userName},
                            </p>
                            <p
                              style={{
                                fontFamily: "sans-serif",
                                fontSize: "14px",
                                fontWeight: "normal",
                                margin: "0",
                                marginBottom: "15px",
                              }}
                            >
                              {t.message1}
                            </p>
                            <div
                              style={{
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #e9ecef",
                                borderRadius: "4px",
                                padding: "15px",
                                margin: "20px 0",
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: "sans-serif",
                                  fontSize: "14px",
                                  fontWeight: "normal",
                                  margin: "0",
                                  marginBottom: "10px",
                                }}
                              >
                                <strong>{t.changeDateLabel}</strong>{" "}
                                {changeDate}
                              </p>
                              <p
                                style={{
                                  fontFamily: "sans-serif",
                                  fontSize: "14px",
                                  fontWeight: "normal",
                                  margin: "0",
                                }}
                              >
                                <strong>Email:</strong> {userEmail}
                              </p>
                            </div>
                            <p
                              style={{
                                fontFamily: "sans-serif",
                                fontSize: "14px",
                                fontWeight: "normal",
                                margin: "0",
                                marginBottom: "15px",
                              }}
                            >
                              {t.message2}
                            </p>
                            <div
                              style={{
                                backgroundColor: "#fff3cd",
                                border: "1px solid #ffeaa7",
                                borderRadius: "4px",
                                padding: "15px",
                                margin: "20px 0",
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: "sans-serif",
                                  fontSize: "14px",
                                  fontWeight: "normal",
                                  margin: "0",
                                  marginBottom: "15px",
                                  color: "#856404",
                                }}
                              >
                                ⚠️ {t.message3}
                              </p>
                              <table
                                role="presentation"
                                style={{
                                  width: "100%",
                                  borderCollapse: "separate",
                                  textSizeAdjust: "100%",
                                  WebkitTextSizeAdjust: "100%",
                                }}
                                className="btn btn-primary"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      style={{
                                        fontFamily: "sans-serif",
                                        fontSize: "14px",
                                        verticalAlign: "top",
                                        paddingBottom: "15px",
                                      }}
                                      align="left"
                                    >
                                      <table
                                        role="presentation"
                                        style={{
                                          borderCollapse: "separate",
                                          textSizeAdjust: "100%",
                                          WebkitTextSizeAdjust: "100%",
                                          width: "auto",
                                        }}
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              style={{
                                                fontFamily: "sans-serif",
                                                fontSize: "14px",
                                                verticalAlign: "top",
                                                borderRadius: "5px",
                                                textAlign: "center",
                                                backgroundColor: "#dc3545",
                                              }}
                                            >
                                              <a
                                                href={supportUrl}
                                                target="_blank"
                                                style={{
                                                  borderRadius: "5px",
                                                  boxSizing: "border-box",
                                                  cursor: "pointer",
                                                  display: "inline-block",
                                                  fontSize: "14px",
                                                  fontWeight: "bold",
                                                  margin: "0",
                                                  padding: "12px 25px",
                                                  textDecoration: "none",
                                                  textTransform: "capitalize",
                                                  backgroundColor: "#dc3545",
                                                  borderColor: "#dc3545",
                                                  color: "#ffffff",
                                                }}
                                              >
                                                {t.buttonText}
                                              </a>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <p
                              style={{
                                fontFamily: "sans-serif",
                                fontSize: "14px",
                                fontWeight: "normal",
                                margin: "0",
                                marginBottom: "10px",
                              }}
                            >
                              {t.message4}
                            </p>
                            <ul
                              style={{
                                fontFamily: "sans-serif",
                                fontSize: "14px",
                                fontWeight: "normal",
                                margin: "0",
                                marginBottom: "15px",
                                paddingLeft: "20px",
                              }}
                            >
                              <li style={{ marginBottom: "5px" }}>
                                {t.recommendation1}
                              </li>
                              <li style={{ marginBottom: "5px" }}>
                                {t.recommendation2}
                              </li>
                              <li style={{ marginBottom: "5px" }}>
                                {t.recommendation3}
                              </li>
                            </ul>
                            <p
                              style={{
                                fontFamily: "sans-serif",
                                fontSize: "14px",
                                fontWeight: "normal",
                                margin: "0",
                                marginBottom: "15px",
                                whiteSpace: "pre-line",
                              }}
                            >
                              {t.footer}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  {/* END MAIN CONTENT AREA */}
                </table>
                {/* END CENTERED WHITE CONTAINER */}

                {/* START FOOTER */}
                <div
                  style={{
                    clear: "both",
                    marginTop: "10px",
                    textAlign: "center",
                    width: "100%",
                  }}
                  className="footer"
                >
                  <table
                    role="presentation"
                    style={{
                      width: "100%",
                      borderCollapse: "separate",
                      textSizeAdjust: "100%",
                      WebkitTextSizeAdjust: "100%",
                    }}
                  >
                    <tr>
                      <td
                        style={{
                          fontFamily: "sans-serif",
                          verticalAlign: "top",
                          paddingBottom: "10px",
                          paddingTop: "10px",
                          color: "#999999",
                          fontSize: "12px",
                          textAlign: "center",
                        }}
                        className="content-block"
                      >
                        <span
                          style={{
                            color: "#999999",
                            fontSize: "12px",
                            textAlign: "center",
                          }}
                          className="apple-link"
                        >
                          NextintelBetterAuth - Secure Password Management
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
                {/* END FOOTER */}
              </div>
            </td>
            <td
              style={{
                fontFamily: "sans-serif",
                fontSize: "14px",
                verticalAlign: "top",
              }}
            >
              &nbsp;
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
}

export default PasswordChangeNotificationEmail;
