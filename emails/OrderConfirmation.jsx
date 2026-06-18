import {
  Html, Head, Preview, Body, Container, Section, Row, Column,
  Heading, Text, Hr, Link,
} from "@react-email/components";
import React from "react";

// Raw passthrough so we can emit Jinja2 control tags into the rendered HTML.
const Raw = ({ children }) => children;

const BRASS = "#a8814a";
const INK = "#1c1714";
const CREAM = "#f5f0e8";
const PAPER = "#faf6ef";
const LINE = "#ddd2bf";
const MUTED = "#6a5f55";
const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const sans = "'Helvetica Neue', Helvetica, Arial, sans-serif";

export default function OrderConfirmation() {
  return (
    <Html lang="de">
      <Head />
      <Preview>Ihre Bestellung {`{{ order_number }}`} bei Beauty Am Schloss</Preview>
      <Body style={{ backgroundColor: CREAM, margin: 0, padding: "32px 0", fontFamily: sans }}>
        <Container style={{ width: "600px", maxWidth: "100%", margin: "0 auto", backgroundColor: CREAM }}>
          {/* Header */}
          <Section style={{ textAlign: "center", padding: "8px 0 28px" }}>
            <Text style={{ margin: "0 0 6px", color: BRASS, fontFamily: serif, fontSize: "11px", letterSpacing: "5px" }}>
              PARFUMERIE · BERLIN
            </Text>
            <Text style={{ margin: 0, color: INK, fontFamily: serif, fontSize: "30px", letterSpacing: "3px" }}>
              BEAUTY <span style={{ color: BRASS, fontStyle: "italic" }}>am</span> SCHLOSS
            </Text>
          </Section>

          {/* Hero / confirmation */}
          <Section style={{ backgroundColor: INK, padding: "44px 40px", textAlign: "center" }}>
            <Text style={{ margin: "0 0 14px", color: BRASS, fontFamily: serif, fontSize: "12px", letterSpacing: "6px" }}>
              — MERCI —
            </Text>
            <Heading style={{ margin: "0 0 14px", color: CREAM, fontFamily: serif, fontWeight: 300, fontSize: "34px", lineHeight: 1.1 }}>
              Bestellung bestätigt.
            </Heading>
            <Text style={{ margin: 0, color: "#ddd2bfcc", fontSize: "14px", lineHeight: 1.7 }}>
              Liebe(r) {`{{ customer_name }}`}, vielen Dank für Ihr Vertrauen.<br />
              Ihre Bestellung wurde aufgenommen und wird sorgfältig für Sie vorbereitet.
            </Text>
          </Section>

          {/* Order meta */}
          <Section style={{ backgroundColor: PAPER, padding: "26px 40px", borderLeft: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}` }}>
            <Row>
              <Column>
                <Text style={{ margin: "0 0 4px", color: BRASS, fontSize: "10px", letterSpacing: "3px" }}>BESTELLNUMMER</Text>
                <Text style={{ margin: 0, color: INK, fontFamily: serif, fontSize: "20px" }}>{`{{ order_number }}`}</Text>
              </Column>
              <Column style={{ textAlign: "right" }}>
                <Text style={{ margin: "0 0 4px", color: BRASS, fontSize: "10px", letterSpacing: "3px" }}>DATUM</Text>
                <Text style={{ margin: 0, color: INK, fontFamily: serif, fontSize: "20px" }}>{`{{ order_date }}`}</Text>
              </Column>
            </Row>
          </Section>

          {/* Items */}
          <Section style={{ backgroundColor: PAPER, padding: "8px 40px 18px", borderLeft: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}` }}>
            <Hr style={{ borderColor: LINE, margin: "0 0 18px" }} />
            <Raw>{`{% for item in items %}`}</Raw>
            <Row style={{ paddingBottom: "14px" }}>
              <Column>
                <Text style={{ margin: "0 0 2px", color: BRASS, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase" }}>{`{{ item.brand }}`}</Text>
                <Text style={{ margin: 0, color: INK, fontFamily: serif, fontSize: "17px" }}>
                  {`{{ item.name }}`} <span style={{ color: MUTED, fontSize: "13px" }}>× {`{{ item.qty }}`}</span>
                </Text>
              </Column>
              <Column style={{ textAlign: "right", verticalAlign: "top" }}>
                <Text style={{ margin: 0, color: INK, fontFamily: serif, fontSize: "16px" }}>{`{{ item.line_total }}`}</Text>
              </Column>
            </Row>
            <Raw>{`{% endfor %}`}</Raw>
          </Section>

          {/* Totals */}
          <Section style={{ backgroundColor: PAPER, padding: "6px 40px 28px", borderLeft: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}` }}>
            <Hr style={{ borderColor: LINE, margin: "0 0 16px" }} />
            <Row>
              <Column><Text style={{ margin: "0 0 6px", color: MUTED, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>Zwischensumme</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ margin: "0 0 6px", color: INK, fontSize: "13px" }}>{`{{ subtotal }}`}</Text></Column>
            </Row>
            <Row>
              <Column><Text style={{ margin: "0 0 6px", color: MUTED, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>Versand</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ margin: "0 0 6px", color: INK, fontSize: "13px" }}>{`{{ shipping_label }}`}</Text></Column>
            </Row>
            <Hr style={{ borderColor: LINE, margin: "12px 0" }} />
            <Row>
              <Column><Text style={{ margin: 0, color: INK, fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase" }}>Gesamt</Text></Column>
              <Column style={{ textAlign: "right" }}><Text style={{ margin: 0, color: INK, fontFamily: serif, fontSize: "26px" }}>{`{{ total }}`}</Text></Column>
            </Row>
          </Section>

          {/* Shipping address */}
          <Section style={{ backgroundColor: PAPER, padding: "0 40px 34px", borderLeft: `1px solid ${LINE}`, borderRight: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
            <Hr style={{ borderColor: LINE, margin: "0 0 16px" }} />
            <Text style={{ margin: "0 0 8px", color: BRASS, fontSize: "10px", letterSpacing: "3px" }}>LIEFERADRESSE</Text>
            <Text style={{ margin: 0, color: INK, fontSize: "14px", lineHeight: 1.7 }}>
              {`{{ ship.name }}`}<br />
              {`{{ ship.address }}`}<br />
              {`{{ ship.postal }}`} {`{{ ship.city }}`}<br />
              {`{{ ship.country }}`}
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center", padding: "30px 40px 8px" }}>
            <Text style={{ margin: "0 0 10px", color: MUTED, fontSize: "13px", lineHeight: 1.7 }}>
              Fragen zu Ihrer Bestellung? Unser Concierge ist für Sie da.
            </Text>
            <Link href="mailto:concierge@beauty-am-schloss.de" style={{ color: BRASS, fontSize: "13px", letterSpacing: "1px" }}>
              concierge@beauty-am-schloss.de
            </Link>
            <Text style={{ margin: "22px 0 0", color: "#8a7a6c", fontSize: "10px", letterSpacing: "2px" }}>
              BEAUTY AM SCHLOSS · Schlossstraße 18 · 10623 Berlin
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
