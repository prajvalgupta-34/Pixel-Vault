from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

def generate_abstract_pdf():
    doc = SimpleDocTemplate("Pixel_Vault_Abstract.pdf", pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    title_style = styles['h1']
    title_style.alignment = 1  # Center alignment
    title = Paragraph("Pixel-Vault: A Feature-Rich NFT Marketplace", title_style)
    story.append(title)
    story.append(Spacer(1, 0.25 * inch))

    # Abstract content
    body_style = styles['BodyText']
    abstract_text = """
    Pixel-Vault is a modern, full-featured NFT marketplace built with a futuristic, cyberpunk aesthetic. 
    It provides a seamless experience for artists, collectors, and traders to discover, create, and trade 
    digital assets on the blockchain.
    <br/><br/>
    <b>Core Features:</b>
    <br/><br/>
    <b>Modern Frontend & UI Components:</b> Built with React, Vite, and Tailwind CSS, the application offers a 
    fast and responsive user interface. It leverages the <b>shadcn/ui</b> component library, which is built on 
    top of Radix UI, providing a rich set of accessible and composable components. This includes elements 
    like <i>Cards</i>, <i>Tabs</i>, <i>Dialogs</i>, <i>Avatars</i>, <i>Buttons</i>, and sophisticated <i>Forms</i> that contribute to a 
    consistent and high-quality user experience across the platform. The application also uses 
    <b>Framer Motion</b> for fluid animations and transitions, enhancing the futuristic feel of the marketplace.
    <br/><br/>
    <b>Secure Authentication:</b> Leverages Supabase for secure and easy user authentication via social 
    providers like Google and GitHub.
    <br/><br/>
    <b>Comprehensive Dashboard:</b> Users have a personalized dashboard to manage their NFT collections, 
    track their portfolio value, view transaction history, and customize their profiles.
    <br/><br/>
    <b>Advanced Minting Options:</b> A user-friendly minting page allows creators to upload their artwork, 
    set properties like price and royalties, and choose between direct minting (paying gas fees upfront) 
    or lazy minting (minting on the first sale to save on gas fees).
    <br/><br/>
    <b>Dynamic Marketplace:</b> The marketplace homepage showcases trending collections, featured NFTs, and 
    real-time market statistics. Users can browse, search, and filter NFTs to find the perfect digital asset.
    <br/><br/>
    <b>Detailed NFT View:</b> Each NFT has a dedicated page with detailed information, including properties, 
    ownership history, and a bidding/purchasing interface.
    <br/><br/>
    <b>Blockchain Integration:</b> The platform is integrated with the Ethereum blockchain using ethers.js and 
    Moralis for fetching on-chain data. NFT metadata is stored on IPFS via NFT.Storage, ensuring 
    decentralization and permanence.
    <br/><br/>
    <b>Technology Stack:</b>
    <br/><br/>
    <b>Frontend:</b> React, Vite, TypeScript, Tailwind CSS
    <br/>
    <b>UI Components:</b> shadcn/ui, Radix UI, Lucide React
    <br/>
    <b>Animation:</b> Framer Motion
    <br/>
    <b>Backend & Database:</b> Supabase
    <br/>
    <b>Blockchain:</b> Ethers.js, Moralis
    <br/>
    <b>Decentralized Storage:</b> IPFS (via NFT.Storage)
    """
    abstract = Paragraph(abstract_text, body_style)
    story.append(abstract)

    doc.build(story)
    print("Successfully generated Pixel_Vault_Abstract.pdf")

if __name__ == '__main__':
    generate_abstract_pdf()